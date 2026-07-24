import {
  MAX_FILE_SIZE,
  MAX_IMAGE_DIMENSION,
  SUPPORTED_MIMES,
  type SupportedMime,
} from "@/lib/types";

export type NamingConvention =
  | "pascalCase"
  | "camelCase"
  | "snakeCase"
  | "kebabCase"
  | "screamingSnake";

export const NAMING_CONVENTIONS: NamingConvention[] = [
  "pascalCase",
  "camelCase",
  "snakeCase",
  "kebabCase",
  "screamingSnake",
];

export function isNamingConvention(value: string): value is NamingConvention {
  return NAMING_CONVENTIONS.includes(value as NamingConvention);
}

function tokenizeFileName(fileName: string): string[] {
  const baseName = fileName.replace(/\.[^.]+$/, "");

  return baseName
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());
}

function formatTokens(
  tokens: string[],
  convention: NamingConvention,
): string {
  if (tokens.length === 0) {
    switch (convention) {
      case "pascalCase":
        return "SvgIcon";
      case "camelCase":
        return "svgIcon";
      case "snakeCase":
        return "svg_icon";
      case "kebabCase":
        return "svg-icon";
      case "screamingSnake":
        return "SVG_ICON";
    }
  }

  switch (convention) {
    case "pascalCase":
      return tokens
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
    case "camelCase":
      return tokens
        .map((part, index) =>
          index === 0
            ? part
            : part.charAt(0).toUpperCase() + part.slice(1),
        )
        .join("");
    case "snakeCase":
      return tokens.join("_");
    case "kebabCase":
      return tokens.join("-");
    case "screamingSnake":
      return tokens.map((part) => part.toUpperCase()).join("_");
  }
}

function applyLeadingDigitPrefix(
  name: string,
  convention: NamingConvention,
): string {
  if (!/^\d/.test(name)) {
    return name;
  }

  switch (convention) {
    case "pascalCase":
      return `Icon${name}`;
    case "camelCase":
      return `icon${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    case "snakeCase":
      return `icon_${name}`;
    case "kebabCase":
      return `icon-${name}`;
    case "screamingSnake":
      return `ICON_${name}`;
  }
}

export function toComponentName(fileName: string): string {
  const tokens = tokenizeFileName(fileName);
  const name = formatTokens(tokens, "pascalCase");
  return applyLeadingDigitPrefix(name, "pascalCase");
}

export function toFileBaseName(
  fileName: string,
  convention: NamingConvention = "pascalCase",
): string {
  const tokens = tokenizeFileName(fileName);
  const name = formatTokens(tokens, convention);
  return applyLeadingDigitPrefix(name, convention);
}

export function isSvgFile(file: File): boolean {
  return (
    file.type === "image/svg+xml" ||
    file.name.toLowerCase().endsWith(".svg")
  );
}

export function getSupportedMime(file: File): SupportedMime | null {
  if (SUPPORTED_MIMES.includes(file.type as SupportedMime)) {
    return file.type as SupportedMime;
  }

  const extension = file.name.toLowerCase().split(".").pop();

  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    default:
      return null;
  }
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return "File size must be 5 MB or less.";
  }

  if (!getSupportedMime(file)) {
    return "Unsupported file type. Use PNG, JPG, JPEG, WebP, or SVG.";
  }

  return null;
}

export function readSvgFile(file: File): Promise<string> {
  return file.text();
}

export function fileToObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

export async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read preview data."));
    };

    reader.onerror = () => {
      reject(new Error("Failed to read preview data."));
    };

    reader.readAsDataURL(blob);
  });
}

export function fileToImageData(
  file: File,
  maxSize = MAX_IMAGE_DIMENSION,
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);

      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas is not supported in this browser."));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      resolve(imageData);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image."));
    };

    image.src = url;
  });
}
