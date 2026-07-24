import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  isNamingConvention,
  type NamingConvention,
} from "@/lib/image-utils";
import type { ConvertOptions } from "@/lib/types";

export type GenerationOptions = Pick<
  ConvertOptions,
  "currentColor" | "forwardRef" | "memo"
> & {
  namingConvention: NamingConvention;
};

export const LEGACY_CONVERT_OPTIONS_KEY = "imagetodev:convert-options";

export const DEFAULT_GENERATION_OPTIONS: Required<GenerationOptions> = {
  currentColor: true,
  forwardRef: true,
  memo: false,
  namingConvention: "pascalCase",
};

type SettingsState = Required<GenerationOptions> & {
  updateOption: (key: keyof Pick<GenerationOptions, "currentColor" | "forwardRef" | "memo">, value: boolean) => void;
  updateNamingConvention: (value: NamingConvention) => void;
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
  const merged: Required<GenerationOptions> = {
    ...DEFAULT_GENERATION_OPTIONS,
    ...partial,
  };

  if (!isNamingConvention(merged.namingConvention)) {
    merged.namingConvention = DEFAULT_GENERATION_OPTIONS.namingConvention;
  }

  return merged;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_GENERATION_OPTIONS,
      updateOption: (key, value) => set({ [key]: value }),
      updateNamingConvention: (value) => set({ namingConvention: value }),
    }),
    {
      name: "imagetodev:settings",
      partialize: (state) => ({
        currentColor: state.currentColor,
        forwardRef: state.forwardRef,
        memo: state.memo,
        namingConvention: state.namingConvention,
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
    namingConvention: state.namingConvention,
  };
}
