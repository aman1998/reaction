import { optimize, type Config } from "svgo/browser";

const SVGO_CONFIG = {
  multipass: true,
  plugins: ["preset-default", "removeDimensions"],
} satisfies Config;

export function optimizeSvg(svg: string): string {
  const result = optimize(svg, SVGO_CONFIG);

  if (!result.data) {
    throw new Error("SVGO failed to optimize SVG.");
  }

  return result.data;
}
