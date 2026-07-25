import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_CODE_FORMATTING,
  isCodeFormatting,
  type CodeFormatting,
} from "@/lib/code-formatting";
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
import {
  DEFAULT_SVG_OPTIMIZATION,
  isSvgOptimization,
  type SvgOptimization,
} from "@/lib/svg-optimization";
import type { ConvertOptions } from "@/lib/types";

export type GenerationOptions = Pick<
  ConvertOptions,
  "currentColor" | "codeFormatting" | "svgOptimization"
> & {
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
  codeFormatting: DEFAULT_CODE_FORMATTING,
  svgOptimization: DEFAULT_SVG_OPTIMIZATION,
};

type SettingsState = Required<GenerationOptions> & {
  updateOption: (
    key: keyof Pick<GenerationOptions, "currentColor">,
    value: boolean,
  ) => void;
  updateComponentStyle: (value: ComponentStyle) => void;
  updateNamingConvention: (value: NamingConvention) => void;
  updateCodeFormatting: (value: CodeFormatting) => void;
  updateSvgOptimization: (value: SvgOptimization) => void;
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

  if (!isCodeFormatting(merged.codeFormatting)) {
    merged.codeFormatting = DEFAULT_GENERATION_OPTIONS.codeFormatting;
  }

  if (!isSvgOptimization(merged.svgOptimization)) {
    merged.svgOptimization = DEFAULT_GENERATION_OPTIONS.svgOptimization;
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
      updateCodeFormatting: (value) => set({ codeFormatting: value }),
      updateSvgOptimization: (value) => set({ svgOptimization: value }),
    }),
    {
      name: "imagetodev:settings",
      partialize: (state) => ({
        currentColor: state.currentColor,
        componentStyle: state.componentStyle,
        namingConvention: state.namingConvention,
        codeFormatting: state.codeFormatting,
        svgOptimization: state.svgOptimization,
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
): Required<
  Pick<
    ConvertOptions,
    "currentColor" | "componentStyle" | "codeFormatting" | "svgOptimization"
  >
> {
  return {
    currentColor: state.currentColor,
    componentStyle: state.componentStyle,
    codeFormatting: state.codeFormatting,
    svgOptimization: state.svgOptimization,
  };
}
