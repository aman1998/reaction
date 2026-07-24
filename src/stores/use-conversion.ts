"use client";

import { useShallow } from "zustand/react/shallow";

import {
  selectActiveItem,
  selectDoneCount,
  selectIsBusy,
  selectProcessingItem,
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
      activeId: state.activeId,
      activeItem: selectActiveItem(state),
      processingItem: selectProcessingItem(state),
      doneCount: selectDoneCount(state),
      totalCount: state.queue.length,
      error: state.error,
      convertFiles: state.convertFiles,
      selectItem: state.selectItem,
      clear: state.clear,
      hydrate: state.hydrate,
      hasHydrated: state.hasHydrated,
      isRetransforming: state.isRetransforming,
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
