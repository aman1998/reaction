import { optimize, type Config } from "svgo/browser";

import {
  DEFAULT_SVG_OPTIMIZATION,
  getSvgoConfig,
  shouldSkipSvgOptimization,
  type SvgOptimization,
} from "@/lib/svg-optimization";

export function optimizeSvg(
  svg: string,
  optimization: SvgOptimization = DEFAULT_SVG_OPTIMIZATION,
): string {
  if (shouldSkipSvgOptimization(optimization)) {
    return svg;
  }

  const config = getSvgoConfig(optimization);

  if (!config) {
    return svg;
  }

  return runSvgo(svg, config);
}

function runSvgo(svg: string, config: Config): string {
  const result = optimize(svg, config);

  if (!result.data) {
    throw new Error("SVGO failed to optimize SVG.");
  }

  return result.data;
}
