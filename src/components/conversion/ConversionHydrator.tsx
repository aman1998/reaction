"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

import { useConversionStore } from "@/stores/conversion-store";
import { useSettingsStore } from "@/stores/settings-store";

function hasGenerationOptionsChanged(
  state: ReturnType<typeof useSettingsStore.getState>,
  previousState: ReturnType<typeof useSettingsStore.getState>,
): boolean {
  return (
    state.currentColor !== previousState.currentColor ||
    state.componentStyle !== previousState.componentStyle ||
    state.codeFormatting !== previousState.codeFormatting ||
    state.svgOptimization !== previousState.svgOptimization
  );
}

export function ConversionHydrator({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasHydrated = useConversionStore((state) => state.hasHydrated);
  const hydrate = useConversionStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    return useSettingsStore.subscribe((state, previousState) => {
      if (!hasGenerationOptionsChanged(state, previousState)) {
        return;
      }

      void useConversionStore.getState().reapplyDoneItems();
    });
  }, []);

  if (!hasHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return children;
}
