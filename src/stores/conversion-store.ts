import { create } from "zustand";

import {
  clearConversionSession,
  loadConversionSession,
  removePersistedItems,
  saveConversionItem,
  saveSessionMeta,
} from "@/lib/conversion-persist";
import { blobUrlToDataUrl, toComponentName, validateFile } from "@/lib/image-utils";
import { processImageClient } from "@/lib/process-client";
import {
  optimizeSvgInWorker,
  transformSvgInWorker,
} from "@/lib/process-worker";
import { selectGenerationOptions, useSettingsStore } from "@/stores/settings-store";

export type QueueStage =
  | "idle"
  | "vectorizing"
  | "generating"
  | "done"
  | "error";

export type QueueItem = {
  id: string;
  fileName: string;
  stage: QueueStage;
  error?: string;
  previewUrl?: string;
  previewDataUrl?: string;
  rawSvg?: string;
  svg?: string;
  jsx?: string;
  tsx?: string;
  componentName?: string;
};

type InternalQueueItem = QueueItem & {
  file: File;
};

export type ConversionView = "upload" | "processing" | "result";

type ConversionState = {
  view: ConversionView;
  queue: QueueItem[];
  activeId: string | null;
  error: string | null;
  isConverting: boolean;
  isRetransforming: boolean;
  hasHydrated: boolean;
  convertFiles: (files: File[]) => void;
  selectItem: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  hydrate: () => Promise<void>;
  reapplyDoneItems: () => Promise<void>;
};

function createId(): string {
  return crypto.randomUUID();
}

function revokePreviewUrl(url: string | undefined): void {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function revokeQueuePreviews(items: QueueItem[]): void {
  for (const item of items) {
    revokePreviewUrl(item.previewUrl);
  }
}

function toPublicItem(item: InternalQueueItem): QueueItem {
  return {
    id: item.id,
    fileName: item.fileName,
    stage: item.stage,
    error: item.error,
    previewUrl: item.previewUrl,
    previewDataUrl: item.previewDataUrl,
    rawSvg: item.rawSvg,
    svg: item.svg,
    jsx: item.jsx,
    tsx: item.tsx,
    componentName: item.componentName,
  };
}

function patchQueueItem(
  queue: QueueItem[],
  id: string,
  patch: Partial<QueueItem>,
): QueueItem[] {
  return queue.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

function getGenerationOptions() {
  return selectGenerationOptions(useSettingsStore.getState());
}

async function persistDoneItem(
  item: QueueItem,
  activeId: string | null,
  view: ConversionView,
): Promise<void> {
  let previewDataUrl = item.previewDataUrl;

  if (item.previewUrl && !previewDataUrl) {
    previewDataUrl = await blobUrlToDataUrl(item.previewUrl);
  }

  const persistedItem: QueueItem = {
    ...item,
    previewDataUrl,
  };

  await saveConversionItem(persistedItem);
  await saveSessionMeta({ activeId, view });
}

let filesById = new Map<string, File>();
let processGeneration = 0;
let retransformGeneration = 0;

export const useConversionStore = create<ConversionState>((set, get) => ({
  view: "upload",
  queue: [],
  activeId: null,
  error: null,
  isConverting: false,
  isRetransforming: false,
  hasHydrated: false,

  hydrate: async () => {
    if (get().hasHydrated) {
      return;
    }

    try {
      const session = await loadConversionSession();

      if (session.items.length === 0) {
        set({ hasHydrated: true });
        return;
      }

      set({
        queue: session.items,
        activeId:
          session.activeId &&
          session.items.some((item) => item.id === session.activeId)
            ? session.activeId
            : (session.items.at(-1)?.id ?? null),
        view: "result",
        hasHydrated: true,
      });
    } catch {
      set({ hasHydrated: true });
    }
  },

  clear: () => {
    processGeneration += 1;
    retransformGeneration += 1;
    revokeQueuePreviews(get().queue);
    filesById = new Map();

    void clearConversionSession();

    set({
      view: "upload",
      queue: [],
      activeId: null,
      error: null,
      isConverting: false,
      isRetransforming: false,
    });
  },

  selectItem: (id) => {
    const item = get().queue.find((entry) => entry.id === id);

    if (!item || item.stage !== "done") {
      return;
    }

    set({ activeId: id, view: "result" });
    void saveSessionMeta({ activeId: id, view: "result" });
  },

  removeItem: (id) => {
    const item = get().queue.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    if (item.stage === "vectorizing" || item.stage === "generating") {
      return;
    }

    revokePreviewUrl(item.previewUrl);
    filesById.delete(id);

    const nextQueue = get().queue.filter((entry) => entry.id !== id);

    if (nextQueue.length === 0) {
      processGeneration += 1;
      retransformGeneration += 1;
      filesById = new Map();

      void clearConversionSession();

      set({
        view: "upload",
        queue: [],
        activeId: null,
        error: null,
        isConverting: false,
        isRetransforming: false,
      });
      return;
    }

    const wasActive = get().activeId === id;
    const hasDone = nextQueue.some((entry) => entry.stage === "done");
    const isBatchRunning = nextQueue.some(
      (entry) =>
        entry.stage === "idle" ||
        entry.stage === "vectorizing" ||
        entry.stage === "generating",
    );

    let nextActiveId = get().activeId;
    let nextView = get().view;

    if (wasActive) {
      nextActiveId =
        nextQueue.find((entry) => entry.stage === "done")?.id ?? null;
      nextView = hasDone
        ? "result"
        : isBatchRunning
          ? "processing"
          : "upload";
    } else if (
      nextActiveId &&
      !nextQueue.some((entry) => entry.id === nextActiveId)
    ) {
      nextActiveId =
        nextQueue.find((entry) => entry.stage === "done")?.id ?? null;
      nextView = hasDone
        ? "result"
        : isBatchRunning
          ? "processing"
          : "upload";
    }

    if (!hasDone && !isBatchRunning) {
      nextView = "upload";
      nextActiveId = null;
    }

    set({
      queue: nextQueue,
      activeId: nextActiveId,
      view: nextView,
      isConverting: isBatchRunning ? get().isConverting : false,
    });

    void removePersistedItems([id]);
    void saveSessionMeta({ activeId: nextActiveId, view: nextView });
  },

  reapplyDoneItems: async () => {
    const doneItems = get().queue.filter(
      (item) => item.stage === "done" && (item.rawSvg || item.svg),
    );

    if (doneItems.length === 0) {
      return;
    }

    const generation = ++retransformGeneration;
    set({ isRetransforming: true });

    try {
      const options = getGenerationOptions();

      for (const item of doneItems) {
        if (generation !== retransformGeneration) {
          return;
        }

        const sourceSvg = item.rawSvg ?? item.svg!;

        let svg = sourceSvg;

        try {
          const optimized = await optimizeSvgInWorker(
            sourceSvg,
            options.svgOptimization,
          );
          svg = optimized.svg;
        } catch {
          continue;
        }

        if (generation !== retransformGeneration) {
          return;
        }

        const transformResult = await transformSvgInWorker({
          svg,
          fileName: item.fileName,
          options: {
            componentName: item.componentName,
            ...options,
          },
        });

        if (generation !== retransformGeneration) {
          return;
        }

        if ("error" in transformResult) {
          continue;
        }

        const nextQueue = patchQueueItem(get().queue, item.id, {
          rawSvg: item.rawSvg ?? sourceSvg,
          svg,
          jsx: transformResult.jsx,
          tsx: transformResult.tsx,
          componentName: transformResult.componentName,
        });

        set({ queue: nextQueue });

        const updatedItem = nextQueue.find((entry) => entry.id === item.id);

        if (updatedItem) {
          await saveConversionItem(updatedItem);
        }
      }
    } finally {
      if (generation === retransformGeneration) {
        set({ isRetransforming: false });
      }
    }
  },

  convertFiles: (files) => {
    const generation = ++processGeneration;

    const existingDone = get().queue.filter((item) => item.stage === "done");
    const inProgress = get().queue.filter(
      (item) =>
        item.stage === "idle" ||
        item.stage === "vectorizing" ||
        item.stage === "generating" ||
        item.stage === "error",
    );

    revokeQueuePreviews(inProgress);
    filesById = new Map();

    const validItems: InternalQueueItem[] = [];
    const validationErrors: string[] = [];

    for (const file of files) {
      const validationError = validateFile(file);

      if (validationError) {
        validationErrors.push(`${file.name}: ${validationError}`);
        continue;
      }

      const id = createId();
      filesById.set(id, file);
      validItems.push({
        id,
        file,
        fileName: file.name,
        stage: "idle",
        componentName: toComponentName(file.name),
      });
    }

    if (validItems.length === 0) {
      set({
        error:
          validationErrors[0] ??
          "No valid files. Use PNG, JPG, JPEG, WebP, or SVG up to 5 MB.",
      });
      return;
    }

    const nextActiveId = get().activeId;
    const startingQueue = [...existingDone, ...validItems.map(toPublicItem)];

    set({
      error: validationErrors.length > 0 ? validationErrors.join(" ") : null,
      view: "processing",
      isConverting: true,
      queue: startingQueue,
    });

    void (async () => {
      for (const item of validItems) {
        if (generation !== processGeneration) {
          return;
        }

        const file = filesById.get(item.id);

        if (!file) {
          continue;
        }

        set({
          queue: patchQueueItem(get().queue, item.id, {
            stage: "vectorizing",
            error: undefined,
          }),
        });

        try {
          const generationOptions = getGenerationOptions();
          const clientResult = await processImageClient(file, {
            componentName: item.componentName,
            svgOptimization: generationOptions.svgOptimization,
          });

          if (generation !== processGeneration) {
            revokePreviewUrl(clientResult.originalPreview);
            return;
          }

          set({
            queue: patchQueueItem(get().queue, item.id, {
              stage: "generating",
              previewUrl: clientResult.originalPreview,
              rawSvg: clientResult.rawSvg,
              svg: clientResult.svg,
              componentName: clientResult.componentName,
            }),
          });

          const transformResult = await transformSvgInWorker({
            svg: clientResult.svg,
            fileName: file.name,
            options: {
              componentName: clientResult.componentName,
              ...generationOptions,
            },
          });

          if (generation !== processGeneration) {
            return;
          }

          if ("error" in transformResult) {
            throw new Error(transformResult.error);
          }

          let previewDataUrl: string | undefined;

          try {
            previewDataUrl = await blobUrlToDataUrl(
              clientResult.originalPreview,
            );
          } catch {
            previewDataUrl = undefined;
          }

          const nextQueue = patchQueueItem(get().queue, item.id, {
            stage: "done",
            previewUrl: clientResult.originalPreview,
            previewDataUrl,
            rawSvg: clientResult.rawSvg,
            svg: clientResult.svg,
            jsx: transformResult.jsx,
            tsx: transformResult.tsx,
            componentName: transformResult.componentName,
          });

          const shouldActivate = get().activeId === null && nextActiveId === null;
          const activeId = shouldActivate
            ? item.id
            : (get().activeId ?? nextActiveId);

          set({
            queue: nextQueue,
            ...(shouldActivate
              ? { activeId: item.id, view: "result" as const }
              : {}),
          });

          const doneItem = nextQueue.find((entry) => entry.id === item.id);

          if (doneItem) {
            await persistDoneItem(
              doneItem,
              shouldActivate ? item.id : activeId,
              "result",
            );
          }
        } catch (conversionError) {
          if (generation !== processGeneration) {
            return;
          }

          const message =
            conversionError instanceof Error
              ? conversionError.message
              : "Conversion failed.";

          set({
            queue: patchQueueItem(get().queue, item.id, {
              stage: "error",
              error: message,
            }),
          });
        }
      }

      if (generation !== processGeneration) {
        return;
      }

      const { queue, activeId } = get();
      const hasDone = queue.some((entry) => entry.stage === "done");

      set({
        isConverting: false,
        view: hasDone ? "result" : "upload",
        activeId: hasDone
          ? (activeId ??
            queue.find((entry) => entry.stage === "done")?.id ??
            null)
          : null,
        error: hasDone
          ? get().error
          : (queue.find((entry) => entry.stage === "error")?.error ??
            "Conversion failed."),
      });

      if (hasDone) {
        await saveSessionMeta({
          activeId: get().activeId,
          view: "result",
        });
      }
    })();
  },
}));

export function selectIsBusy(state: ConversionState): boolean {
  return (
    state.isConverting ||
    state.queue.some(
      (item) => item.stage === "vectorizing" || item.stage === "generating",
    )
  );
}

export function selectActiveItem(state: ConversionState): QueueItem | null {
  if (!state.activeId) {
    return null;
  }

  return state.queue.find((item) => item.id === state.activeId) ?? null;
}

export function selectDoneCount(state: ConversionState): number {
  return state.queue.filter((item) => item.stage === "done").length;
}

export function selectProcessingItem(state: ConversionState): QueueItem | null {
  return (
    state.queue.find(
      (item) => item.stage === "vectorizing" || item.stage === "generating",
    ) ?? null
  );
}
