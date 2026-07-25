import {
  fileToImageData,
  fileToObjectUrl,
  getSupportedMime,
  isSvgFile,
  readSvgFile,
  toComponentName,
  validateFile,
} from "@/lib/image-utils";
import {
  optimizeSvgInWorker,
  vectorizeAndOptimizeInWorker,
} from "@/lib/process-worker";
import type { ClientProcessResult, ConvertOptions } from "@/lib/types";

export async function processImageClient(
  file: File,
  options: Pick<ConvertOptions, "componentName" | "svgOptimization"> = {},
): Promise<ClientProcessResult> {
  const validationError = validateFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const mime = getSupportedMime(file);

  if (!mime) {
    throw new Error("Unsupported file type. Use PNG, JPG, JPEG, WebP, or SVG.");
  }

  const componentName = options.componentName ?? toComponentName(file.name);
  const originalPreview = fileToObjectUrl(file);
  const svgOptimization = options.svgOptimization ?? "balanced";

  let processed: { svg: string; rawSvg: string };

  if (isSvgFile(file) || mime === "image/svg+xml") {
    const rawSvg = await readSvgFile(file);
    processed = await optimizeSvgInWorker(rawSvg, svgOptimization);
  } else {
    const imageData = await fileToImageData(file);
    processed = await vectorizeAndOptimizeInWorker(imageData, svgOptimization);
  }

  return {
    svg: processed.svg,
    rawSvg: processed.rawSvg,
    originalPreview,
    componentName,
  };
}
