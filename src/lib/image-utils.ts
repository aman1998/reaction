import {
  MAX_FILE_SIZE,
  MAX_IMAGE_DIMENSION,
  SUPPORTED_MIMES,
  type SupportedMime,
} from "@/lib/types";

export function toComponentName(fileName: string): string {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const normalized = baseName
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

  if (!normalized) {
    return "SvgIcon";
  }

  if (/^\d/.test(normalized)) {
    return `Icon${normalized}`;
  }

  return normalized;
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
