import { transform } from "@svgr/core";
import jsxPlugin from "@svgr/plugin-jsx";

import {
  DEFAULT_COMPONENT_STYLE,
  getSvgrStyleOptions,
} from "@/lib/component-style";
import { toComponentName } from "@/lib/image-utils";
import type { ConvertOptions } from "@/lib/types";

function buildSvgrConfig(
  options: ConvertOptions,
  typescript: boolean,
  componentName: string,
) {
  const style = getSvgrStyleOptions(
    options.componentStyle ?? DEFAULT_COMPONENT_STYLE,
  );

  const config: Parameters<typeof transform>[1] = {
    plugins: [jsxPlugin],
    typescript,
    ref: style.forwardRef,
    memo: style.memo,
    svgo: false,
    prettier: true,
    jsxRuntime: "automatic",
    exportType: style.exportType,
  };

  if (style.exportType === "named") {
    config.namedExport = componentName;
  }

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
    transform(
      svg,
      buildSvgrConfig(options, false, componentName),
      state,
    ),
    transform(svg, buildSvgrConfig(options, true, componentName), state),
  ]);

  return { jsx, tsx };
}
