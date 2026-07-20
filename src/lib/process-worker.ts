type RasterPayload = {
  type: "raster";
  imageData: ImageData;
};

type SvgPayload = {
  type: "svg";
  rawSvg: string;
};

type WorkerRequest = (RasterPayload | SvgPayload) & { id: number };

type WorkerSuccess = {
  id: number;
  svg: string;
};

type WorkerFailure = {
  id: number;
  error: string;
};

type WorkerResponse = WorkerSuccess | WorkerFailure;

let worker: Worker | null = null;
let nextRequestId = 0;
const pendingRequests = new Map<
  number,
  {
    resolve: (svg: string) => void;
    reject: (error: Error) => void;
  }
>();

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

      pending.resolve(event.data.svg);
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

function runWorkerTask(payload: RasterPayload | SvgPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = nextRequestId++;
    pendingRequests.set(id, { resolve, reject });

    const request: WorkerRequest = { id, ...payload };
    getWorker().postMessage(request);
  });
}

export function vectorizeAndOptimizeInWorker(
  imageData: ImageData,
): Promise<string> {
  return runWorkerTask({ type: "raster", imageData });
}

export function optimizeSvgInWorker(rawSvg: string): Promise<string> {
  return runWorkerTask({ type: "svg", rawSvg });
}
