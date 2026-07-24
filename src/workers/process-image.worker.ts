import { toComponentName } from "@/lib/image-utils";
import { optimizeSvg } from "@/lib/optimize";
import { transformToReact } from "@/lib/transform";
import { MAX_SVG_SIZE, type ConvertOptions } from "@/lib/types";
import { vectorizeRaster } from "@/lib/vectorize";

type RasterMessage = {
  id: number;
  type: "raster";
  imageData: ImageData;
};

type SvgMessage = {
  id: number;
  type: "svg";
  rawSvg: string;
};

type TransformMessage = {
  id: number;
  type: "transform";
  svg: string;
  fileName: string;
  options: ConvertOptions;
};

type WorkerRequest = RasterMessage | SvgMessage | TransformMessage;

type SvgWorkerSuccess = {
  id: number;
  svg: string;
};

type TransformWorkerSuccess = {
  id: number;
  jsx: string;
  tsx: string;
  componentName: string;
};

type WorkerFailure = {
  id: number;
  error: string;
};

type WorkerResponse = SvgWorkerSuccess | TransformWorkerSuccess | WorkerFailure;

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, type } = event.data;

  try {
    if (type === "transform") {
      const { svg, fileName, options } = event.data;

      if (!svg.trim()) {
        throw new Error("SVG content is empty.");
      }

      if (svg.length > MAX_SVG_SIZE) {
        throw new Error("Optimized SVG is too large to transform.");
      }

      if (!svg.includes("<svg")) {
        throw new Error("Invalid SVG content.");
      }

      const componentName = options.componentName ?? toComponentName(fileName);
      const { jsx, tsx } = await transformToReact(svg, fileName, {
        ...options,
        componentName,
      });

      const response: TransformWorkerSuccess = {
        id,
        jsx,
        tsx,
        componentName,
      };
      self.postMessage(response);
      return;
    }

    let svg: string;

    if (type === "raster") {
      const rawSvg = await vectorizeRaster(event.data.imageData);
      svg = optimizeSvg(rawSvg);
    } else {
      svg = optimizeSvg(event.data.rawSvg);
    }

    const response: SvgWorkerSuccess = { id, svg };
    self.postMessage(response);
  } catch (processingError) {
    const response: WorkerFailure = {
      id,
      error:
        processingError instanceof Error
          ? processingError.message
          : "Image processing failed.",
    };
    self.postMessage(response);
  }
};
