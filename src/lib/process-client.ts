import {
  fileToImageData,
  fileToObjectUrl,
  getSupportedMime,
  isSvgFile,
  readSvgFile,
  toComponentName,
  validateFile,
} from "@/lib/image-utils";
import { optimizeSvg } from "@/lib/optimize";
import type { ClientProcessResult, ConvertOptions } from "@/lib/types";
import { vectorizeRaster } from "@/lib/vectorize";

export async function processImageClient(
  file: File,
  options: Pick<ConvertOptions, "componentName"> = {},
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

  let rawSvg: string;

  if (isSvgFile(file) || mime === "image/svg+xml") {
    rawSvg = await readSvgFile(file);
  } else {
    const imageData = await fileToImageData(file);
    rawSvg = await vectorizeRaster(imageData);
  }

  const svg = optimizeSvg(rawSvg);

  return {
    svg,
    originalPreview,
    componentName,
  };
}
