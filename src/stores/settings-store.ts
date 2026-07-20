import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ConvertOptions } from "@/lib/types";

export type GenerationOptions = Pick<
  ConvertOptions,
  "currentColor" | "forwardRef" | "memo"
>;

export const LEGACY_CONVERT_OPTIONS_KEY = "imagetodev:convert-options";

export const DEFAULT_GENERATION_OPTIONS: Required<GenerationOptions> = {
  currentColor: true,
  forwardRef: true,
  memo: false,
};

type SettingsState = Required<GenerationOptions> & {
  updateOption: (key: keyof GenerationOptions, value: boolean) => void;
};

function readLegacyOptions(): Partial<GenerationOptions> | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(LEGACY_CONVERT_OPTIONS_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as Partial<GenerationOptions>;
  } catch {
    return null;
  }
}

function mergeGenerationOptions(
  partial: Partial<GenerationOptions> | null | undefined,
): Required<GenerationOptions> {
  return {
    ...DEFAULT_GENERATION_OPTIONS,
    ...partial,
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_GENERATION_OPTIONS,
      updateOption: (key, value) => set({ [key]: value }),
    }),
    {
      name: "imagetodev:settings",
      partialize: (state) => ({
        currentColor: state.currentColor,
        forwardRef: state.forwardRef,
        memo: state.memo,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...mergeGenerationOptions(
          persistedState as Partial<GenerationOptions> | undefined,
        ),
      }),
      onRehydrateStorage: () => () => {
        if (typeof window === "undefined") {
          return;
        }

        if (window.localStorage.getItem("imagetodev:settings")) {
          return;
        }

        const legacyOptions = readLegacyOptions();

        if (!legacyOptions) {
          return;
        }

        useSettingsStore.setState(mergeGenerationOptions(legacyOptions));
        window.localStorage.removeItem(LEGACY_CONVERT_OPTIONS_KEY);
      },
    },
  ),
);

export function selectGenerationOptions(
  state: SettingsState,
): Required<GenerationOptions> {
  return {
    currentColor: state.currentColor,
    forwardRef: state.forwardRef,
    memo: state.memo,
  };
}
