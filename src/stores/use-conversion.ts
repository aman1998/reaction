"use client";

import { useShallow } from "zustand/react/shallow";

import {
  selectIsBusy,
  useConversionStore,
  type ConversionView,
  type QueueItem,
  type QueueStage,
} from "@/stores/conversion-store";
import {
  selectGenerationOptions,
  useSettingsStore,
  type GenerationOptions,
} from "@/stores/settings-store";

export type { ConversionView, GenerationOptions, QueueItem, QueueStage };

export function useConversion() {
  const conversion = useConversionStore(
    useShallow((state) => ({
      view: state.view,
      queue: state.queue,
      originalPreview: state.originalPreview,
      svg: state.svg,
      jsx: state.jsx,
      tsx: state.tsx,
      componentName: state.componentName,
      error: state.error,
      convert: state.convert,
      reset: state.reset,
      isBusy: selectIsBusy(state),
    })),
  );

  const options = useSettingsStore(useShallow(selectGenerationOptions));
  const updateOption = useSettingsStore((state) => state.updateOption);

  return {
    ...conversion,
    options,
    updateOption,
  };
}
