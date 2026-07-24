import type { ComponentStyle } from "@/lib/component-style";

export type SupportedMime =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/svg+xml";

export const SUPPORTED_MIMES: SupportedMime[] = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_SVG_SIZE = 500 * 1024;
export const MAX_IMAGE_DIMENSION = 1024;

export type ConvertOptions = {
  componentName?: string;
  componentStyle?: ComponentStyle;
  currentColor?: boolean;
};

export type ClientProcessResult = {
  svg: string;
  originalPreview: string;
  componentName: string;
};

export type TransformResult = {
  jsx: string;
  tsx: string;
  componentName: string;
};

export type ConvertResult = ClientProcessResult & TransformResult;

export type TransformActionInput = {
  svg: string;
  fileName: string;
  options: ConvertOptions;
};

export type TransformActionResult =
  | TransformResult
  | { error: string };
