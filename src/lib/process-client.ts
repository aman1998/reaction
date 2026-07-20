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

  let svg: string;

  if (isSvgFile(file) || mime === "image/svg+xml") {
    const rawSvg = await readSvgFile(file);
    svg = await optimizeSvgInWorker(rawSvg);
  } else {
    const imageData = await fileToImageData(file);
    svg = await vectorizeAndOptimizeInWorker(imageData);
  }

  return {
    svg,
    originalPreview,
    componentName,
  };
}
