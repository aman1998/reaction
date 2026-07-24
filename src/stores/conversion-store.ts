import { create } from "zustand";

import { transformAction } from "@/app/actions/transform";
import { toComponentName, validateFile } from "@/lib/image-utils";
import { processImageClient } from "@/lib/process-client";
import { useSettingsStore } from "@/stores/settings-store";

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
  convertFiles: (files: File[]) => void;
  selectItem: (id: string) => void;
  reset: () => void;
};

function createId(): string {
  return crypto.randomUUID();
}

function revokePreviewUrl(url: string | undefined): void {
  if (url) {
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

let filesById = new Map<string, File>();
let processGeneration = 0;

export const useConversionStore = create<ConversionState>((set, get) => ({
  view: "upload",
  queue: [],
  activeId: null,
  error: null,
  isConverting: false,

  reset: () => {
    processGeneration += 1;
    revokeQueuePreviews(get().queue);
    filesById = new Map();

    set({
      view: "upload",
      queue: [],
      activeId: null,
      error: null,
      isConverting: false,
    });
  },

  selectItem: (id) => {
    const item = get().queue.find((entry) => entry.id === id);

    if (!item || item.stage !== "done") {
      return;
    }

    set({ activeId: id, view: "result" });
  },

  convertFiles: (files) => {
    const generation = ++processGeneration;
    revokeQueuePreviews(get().queue);
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
        view: "upload",
        queue: [],
        activeId: null,
        error:
          validationErrors[0] ??
          "No valid files. Use PNG, JPG, JPEG, WebP, or SVG up to 5 MB.",
        isConverting: false,
      });
      return;
    }

    set({
      error: validationErrors.length > 0 ? validationErrors.join(" ") : null,
      view: "processing",
      isConverting: true,
      activeId: null,
      queue: validItems.map(toPublicItem),
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
          const clientResult = await processImageClient(file, {
            componentName: item.componentName,
          });

          if (generation !== processGeneration) {
            revokePreviewUrl(clientResult.originalPreview);
            return;
          }

          const { currentColor, forwardRef, memo } =
            useSettingsStore.getState();

          set({
            queue: patchQueueItem(get().queue, item.id, {
              stage: "generating",
              previewUrl: clientResult.originalPreview,
              svg: clientResult.svg,
              componentName: clientResult.componentName,
            }),
          });

          const transformResult = await transformAction({
            svg: clientResult.svg,
            fileName: file.name,
            options: {
              componentName: clientResult.componentName,
              currentColor,
              forwardRef,
              memo,
            },
          });

          if (generation !== processGeneration) {
            return;
          }

          if ("error" in transformResult) {
            throw new Error(transformResult.error);
          }

          const nextQueue = patchQueueItem(get().queue, item.id, {
            stage: "done",
            previewUrl: clientResult.originalPreview,
            svg: clientResult.svg,
            jsx: transformResult.jsx,
            tsx: transformResult.tsx,
            componentName: transformResult.componentName,
          });

          const shouldActivate = get().activeId === null;

          set({
            queue: nextQueue,
            ...(shouldActivate
              ? { activeId: item.id, view: "result" as const }
              : {}),
          });
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
          ? (activeId ?? queue.find((entry) => entry.stage === "done")?.id ?? null)
          : null,
        error: hasDone
          ? get().error
          : (queue.find((entry) => entry.stage === "error")?.error ??
            "Conversion failed."),
      });
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
