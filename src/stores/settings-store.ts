import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_COMPONENT_STYLE,
  isComponentStyle,
  migrateLegacyOptions,
  type ComponentStyle,
} from "@/lib/component-style";
import {
  isNamingConvention,
  type NamingConvention,
} from "@/lib/image-utils";
import type { ConvertOptions } from "@/lib/types";

export type GenerationOptions = Pick<ConvertOptions, "currentColor"> & {
  componentStyle: ComponentStyle;
  namingConvention: NamingConvention;
};

type PersistedGenerationOptions = Partial<
  GenerationOptions & {
    forwardRef?: boolean;
    memo?: boolean;
  }
>;

export const LEGACY_CONVERT_OPTIONS_KEY = "imagetodev:convert-options";

export const DEFAULT_GENERATION_OPTIONS: Required<GenerationOptions> = {
  currentColor: true,
  componentStyle: DEFAULT_COMPONENT_STYLE,
  namingConvention: "pascalCase",
};

type SettingsState = Required<GenerationOptions> & {
  updateOption: (
    key: keyof Pick<GenerationOptions, "currentColor">,
    value: boolean,
  ) => void;
  updateComponentStyle: (value: ComponentStyle) => void;
  updateNamingConvention: (value: NamingConvention) => void;
};

function readLegacyOptions(): PersistedGenerationOptions | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(LEGACY_CONVERT_OPTIONS_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as PersistedGenerationOptions;
  } catch {
    return null;
  }
}

function mergeGenerationOptions(
  partial: PersistedGenerationOptions | null | undefined,
): Required<GenerationOptions> {
  if (!partial) {
    return { ...DEFAULT_GENERATION_OPTIONS };
  }

  const { forwardRef, memo, ...rest } = partial;
  const merged: Required<GenerationOptions> = {
    ...DEFAULT_GENERATION_OPTIONS,
    ...rest,
  };

  if (!isComponentStyle(merged.componentStyle)) {
    merged.componentStyle =
      forwardRef !== undefined || memo !== undefined
        ? migrateLegacyOptions({ forwardRef, memo })
        : DEFAULT_GENERATION_OPTIONS.componentStyle;
  }

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
      updateComponentStyle: (value) => set({ componentStyle: value }),
      updateNamingConvention: (value) => set({ namingConvention: value }),
    }),
    {
      name: "imagetodev:settings",
      partialize: (state) => ({
        currentColor: state.currentColor,
        componentStyle: state.componentStyle,
        namingConvention: state.namingConvention,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...mergeGenerationOptions(
          persistedState as PersistedGenerationOptions | undefined,
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
    componentStyle: state.componentStyle,
    namingConvention: state.namingConvention,
  };
}
