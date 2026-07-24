"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

import { useConversionStore } from "@/stores/conversion-store";
import { useSettingsStore } from "@/stores/settings-store";

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
      if (
        state.currentColor === previousState.currentColor &&
        state.forwardRef === previousState.forwardRef &&
        state.memo === previousState.memo
      ) {
        return;
      }

      void useConversionStore.getState().retransformDoneItems();
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
