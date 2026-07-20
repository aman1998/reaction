type ImageTracerModule = {
  imagedataToSVG: (
    imageData: ImageData,
    options?: Record<string, unknown>,
  ) => string;
};

const DEFAULT_OPTIONS = {
  ltres: 1,
  qtres: 1,
  pathomit: 8,
  colorsampling: 2,
  numberofcolors: 16,
  mincolorratio: 0.02,
  colorquantcycles: 3,
  scale: 1,
  strokewidth: 1,
  linefilter: true,
  viewbox: true,
};

let imageTracerPromise: Promise<ImageTracerModule> | null = null;

async function loadImageTracer(): Promise<ImageTracerModule> {
  if (!imageTracerPromise) {
    imageTracerPromise = import("imagetracerjs").then((module) => {
      const tracer = module.default ?? module;

      if (
        !tracer ||
        typeof (tracer as ImageTracerModule).imagedataToSVG !== "function"
      ) {
        throw new Error("ImageTracerJS failed to load.");
      }

      return tracer as ImageTracerModule;
    });
  }

  return imageTracerPromise;
}

export async function vectorizeRaster(imageData: ImageData): Promise<string> {
  const ImageTracer = await loadImageTracer();
  const svg = ImageTracer.imagedataToSVG(imageData, DEFAULT_OPTIONS);

  if (!svg || !svg.includes("<svg")) {
    throw new Error("Vectorization failed to produce SVG.");
  }

  return svg;
}
