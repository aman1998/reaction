import { transform } from "@svgr/core";
import jsxPlugin from "@svgr/plugin-jsx";

import { toComponentName } from "@/lib/image-utils";
import type { ConvertOptions } from "@/lib/types";

function buildSvgrConfig(options: ConvertOptions, typescript: boolean) {
  const config: Parameters<typeof transform>[1] = {
    plugins: [jsxPlugin],
    typescript,
    ref: options.forwardRef ?? false,
    memo: options.memo ?? false,
    svgo: false,
    prettier: true,
    jsxRuntime: "automatic",
    exportType: "default",
  };

  if (options.currentColor) {
    config.replaceAttrValues = {
      "#000": "currentColor",
      "#000000": "currentColor",
      black: "currentColor",
    };
    config.svgProps = {
      fill: "currentColor",
    };
  }

  return config;
}

export async function transformToReact(
  svg: string,
  fileName: string,
  options: ConvertOptions = {},
): Promise<{ jsx: string; tsx: string }> {
  const componentName = options.componentName ?? toComponentName(fileName);
  const state = { componentName };

  const [jsx, tsx] = await Promise.all([
    transform(svg, buildSvgrConfig(options, false), state),
    transform(svg, buildSvgrConfig(options, true), state),
  ]);

  return { jsx, tsx };
}
