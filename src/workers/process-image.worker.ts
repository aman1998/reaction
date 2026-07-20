import { optimizeSvg } from "@/lib/optimize";
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

type WorkerRequest = RasterMessage | SvgMessage;

type WorkerSuccess = {
  id: number;
  svg: string;
};

type WorkerFailure = {
  id: number;
  error: string;
};

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, type } = event.data;

  try {
    let svg: string;

    if (type === "raster") {
      const rawSvg = await vectorizeRaster(event.data.imageData);
      svg = optimizeSvg(rawSvg);
    } else {
      svg = optimizeSvg(event.data.rawSvg);
    }

    const response: WorkerSuccess = { id, svg };
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
