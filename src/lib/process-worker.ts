import type {
  ConvertOptions,
  TransformActionInput,
  TransformActionResult,
  TransformResult,
} from "@/lib/types";

type RasterPayload = {
  type: "raster";
  imageData: ImageData;
};

type SvgPayload = {
  type: "svg";
  rawSvg: string;
};

type TransformPayload = {
  type: "transform";
  svg: string;
  fileName: string;
  options: ConvertOptions;
};

type WorkerRequest = (RasterPayload | SvgPayload | TransformPayload) & {
  id: number;
};

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

type PendingRequest =
  | {
      kind: "svg";
      resolve: (svg: string) => void;
      reject: (error: Error) => void;
    }
  | {
      kind: "transform";
      resolve: (result: TransformResult) => void;
      reject: (error: Error) => void;
    };

let worker: Worker | null = null;
let nextRequestId = 0;
const pendingRequests = new Map<number, PendingRequest>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(
      new URL("../workers/process-image.worker.ts", import.meta.url),
    );

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id } = event.data;
      const pending = pendingRequests.get(id);

      if (!pending) {
        return;
      }

      pendingRequests.delete(id);

      if ("error" in event.data) {
        pending.reject(new Error(event.data.error));
        return;
      }

      if (pending.kind === "svg") {
        if (!("svg" in event.data)) {
          pending.reject(new Error("Unexpected worker response."));
          return;
        }

        pending.resolve(event.data.svg);
        return;
      }

      if (!("jsx" in event.data)) {
        pending.reject(new Error("Unexpected worker response."));
        return;
      }

      pending.resolve({
        jsx: event.data.jsx,
        tsx: event.data.tsx,
        componentName: event.data.componentName,
      });
    };

    worker.onerror = (event) => {
      for (const pending of pendingRequests.values()) {
        pending.reject(new Error(event.message || "Worker failed."));
      }

      pendingRequests.clear();
      worker?.terminate();
      worker = null;
    };
  }

  return worker;
}

function runSvgWorkerTask(payload: RasterPayload | SvgPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = nextRequestId++;
    pendingRequests.set(id, { kind: "svg", resolve, reject });

    const request: WorkerRequest = { id, ...payload };
    getWorker().postMessage(request);
  });
}

function runTransformWorkerTask(
  payload: TransformPayload,
): Promise<TransformResult> {
  return new Promise((resolve, reject) => {
    const id = nextRequestId++;
    pendingRequests.set(id, { kind: "transform", resolve, reject });

    const request: WorkerRequest = { id, ...payload };
    getWorker().postMessage(request);
  });
}

export function vectorizeAndOptimizeInWorker(
  imageData: ImageData,
): Promise<string> {
  return runSvgWorkerTask({ type: "raster", imageData });
}

export function optimizeSvgInWorker(rawSvg: string): Promise<string> {
  return runSvgWorkerTask({ type: "svg", rawSvg });
}

export async function transformSvgInWorker(
  input: TransformActionInput,
): Promise<TransformActionResult> {
  try {
    return await runTransformWorkerTask({
      type: "transform",
      svg: input.svg,
      fileName: input.fileName,
      options: input.options,
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to transform SVG into a React component.",
    };
  }
}
