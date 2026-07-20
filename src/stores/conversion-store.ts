import { create } from "zustand";

import { transformAction } from "@/app/actions/transform";
import { toComponentName } from "@/lib/image-utils";
import { processImageClient } from "@/lib/process-client";
import { useSettingsStore } from "@/stores/settings-store";

export type QueueStage =
  | "idle"
  | "vectorizing"
  | "generating"
  | "done"
  | "error";

export type QueueItem = {
  fileName: string;
  stage: QueueStage;
  error?: string;
  previewUrl?: string;
};

export type ConversionView = "upload" | "processing" | "result";

type ConversionState = {
  view: ConversionView;
  queue: QueueItem | null;
  originalPreview: string | null;
  svg: string | null;
  jsx: string | null;
  tsx: string | null;
  componentName: string | null;
  error: string | null;
  isConverting: boolean;
  convert: (file: File) => void;
  reset: () => void;
};

function revokePreviewUrl(url: string | null): void {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

export const useConversionStore = create<ConversionState>((set, get) => ({
  view: "upload",
  queue: null,
  originalPreview: null,
  svg: null,
  jsx: null,
  tsx: null,
  componentName: null,
  error: null,
  isConverting: false,

  reset: () => {
    revokePreviewUrl(get().originalPreview);

    set({
      view: "upload",
      queue: null,
      error: null,
      svg: null,
      jsx: null,
      tsx: null,
      componentName: null,
      originalPreview: null,
      isConverting: false,
    });
  },

  convert: (file) => {
    const nextComponentName = toComponentName(file.name);
    const { originalPreview } = get();

    revokePreviewUrl(originalPreview);

    set({
      error: null,
      svg: null,
      jsx: null,
      tsx: null,
      componentName: nextComponentName,
      originalPreview: null,
      view: "processing",
      isConverting: true,
      queue: {
        fileName: file.name,
        stage: "vectorizing",
      },
    });

    void (async () => {
      try {
        const clientResult = await processImageClient(file, {
          componentName: nextComponentName,
        });

        const { currentColor, forwardRef, memo } = useSettingsStore.getState();

        set({
          originalPreview: clientResult.originalPreview,
          svg: clientResult.svg,
          componentName: clientResult.componentName,
          queue: {
            fileName: file.name,
            stage: "generating",
            previewUrl: clientResult.originalPreview,
          },
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

        if ("error" in transformResult) {
          throw new Error(transformResult.error);
        }

        set({
          jsx: transformResult.jsx,
          tsx: transformResult.tsx,
          componentName: transformResult.componentName,
          view: "result",
          queue: {
            fileName: file.name,
            stage: "done",
            previewUrl: clientResult.originalPreview,
          },
        });
      } catch (conversionError) {
        const message =
          conversionError instanceof Error
            ? conversionError.message
            : "Conversion failed.";

        set({
          error: message,
          view: "upload",
          queue: {
            fileName: file.name,
            stage: "error",
            error: message,
          },
        });
      } finally {
        set({ isConverting: false });
      }
    })();
  },
}));

export function selectIsBusy(state: ConversionState): boolean {
  return (
    state.isConverting ||
    state.queue?.stage === "vectorizing" ||
    state.queue?.stage === "generating"
  );
}
