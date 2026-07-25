import type { Config } from "svgo/browser";

export type SvgOptimization =
  | "none"
  | "balanced"
  | "minimal"
  | "conservative";

export const SVG_OPTIMIZATIONS: SvgOptimization[] = [
  "none",
  "balanced",
  "minimal",
  "conservative",
];

export const DEFAULT_SVG_OPTIMIZATION: SvgOptimization = "balanced";

export type SvgOptimizationOption = {
  value: SvgOptimization;
  label: string;
  description: string;
};

export const SVG_OPTIMIZATION_OPTIONS: SvgOptimizationOption[] = [
  {
    value: "none",
    label: "None",
    description: "Skip SVGO — largest SVG, closest to source",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Default optimization with dimensions removed",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Smaller SVG with aggressive path simplification",
  },
  {
    value: "conservative",
    label: "Conservative",
    description: "Light cleanup, keeps width and height",
  },
];

export function isSvgOptimization(value: string): value is SvgOptimization {
  return SVG_OPTIMIZATIONS.includes(value as SvgOptimization);
}

export function getSvgOptimizationLabel(optimization: SvgOptimization): string {
  return (
    SVG_OPTIMIZATION_OPTIONS.find((option) => option.value === optimization)
      ?.label ?? optimization
  );
}

export function shouldSkipSvgOptimization(
  optimization: SvgOptimization | undefined,
): boolean {
  return optimization === "none";
}

export function getSvgoConfig(
  optimization: SvgOptimization,
): Config | null {
  switch (optimization) {
    case "none":
      return null;
    case "balanced":
      return {
        multipass: true,
        plugins: ["preset-default", "removeDimensions"],
      };
    case "minimal":
      return {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupIds: true,
                mergePaths: true,
                convertPathData: true,
              },
            },
          },
          "removeDimensions",
        ],
      } as Config;
    case "conservative":
      return {
        multipass: false,
        plugins: [
          "removeDoctype",
          "removeXMLProcInst",
          "removeComments",
          "removeMetadata",
          "removeEditorsNSData",
          "cleanupAttrs",
          "mergeStyles",
          "inlineStyles",
          "minifyStyles",
          "cleanupIds",
          "removeUselessDefs",
          "cleanupNumericValues",
          "convertColors",
          "removeUnknownsAndDefaults",
          "removeNonInheritableGroupAttrs",
          "removeUselessStrokeAndFill",
        ],
      };
  }
}
