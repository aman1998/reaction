import JSZip from "jszip";

import { toFileBaseName, type NamingConvention } from "@/lib/image-utils";
import type { QueueItem } from "@/stores/conversion-store";

export type ZipExportFormat = "tsx" | "jsx" | "svg" | "all";

const DEFAULT_ARCHIVE_NAMES: Record<ZipExportFormat, string> = {
  tsx: "imagetodev-tsx.zip",
  jsx: "imagetodev-jsx.zip",
  svg: "imagetodev-svg.zip",
  all: "imagetodev-components.zip",
};

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function getUniqueName(
  baseName: string,
  usedNames: Map<string, number>,
): string {
  const count = usedNames.get(baseName) ?? 0;
  usedNames.set(baseName, count + 1);
  return count === 0 ? baseName : `${baseName}_${count + 1}`;
}

function filterDoneItems(
  items: QueueItem[],
  format: ZipExportFormat,
): QueueItem[] {
  return items.filter((item) => {
    if (item.stage !== "done" || !item.componentName) {
      return false;
    }

    switch (format) {
      case "tsx":
        return Boolean(item.tsx);
      case "jsx":
        return Boolean(item.jsx);
      case "svg":
        return Boolean(item.svg);
      case "all":
        return Boolean(item.svg && item.jsx && item.tsx);
    }
  });
}

function addFilesToZip(
  zip: JSZip,
  item: QueueItem,
  uniqueName: string,
  format: ZipExportFormat,
): void {
  switch (format) {
    case "tsx":
      zip.file(`${uniqueName}.tsx`, item.tsx!);
      break;
    case "jsx":
      zip.file(`${uniqueName}.jsx`, item.jsx!);
      break;
    case "svg":
      zip.file(`${uniqueName}.svg`, item.svg!);
      break;
    case "all":
      zip.folder("tsx")!.file(`${uniqueName}.tsx`, item.tsx!);
      zip.folder("jsx")!.file(`${uniqueName}.jsx`, item.jsx!);
      zip.folder("svg")!.file(`${uniqueName}.svg`, item.svg!);
      break;
  }
}

export async function downloadComponentsZip(
  items: QueueItem[],
  format: ZipExportFormat = "all",
  convention: NamingConvention = "pascalCase",
  archiveName = DEFAULT_ARCHIVE_NAMES[format],
): Promise<void> {
  const doneItems = filterDoneItems(items, format);

  if (doneItems.length === 0) {
    return;
  }

  const zip = new JSZip();
  const usedNames = new Map<string, number>();

  for (const item of doneItems) {
    const baseName = toFileBaseName(item.fileName, convention);
    const uniqueName = getUniqueName(baseName, usedNames);
    addFilesToZip(zip, item, uniqueName, format);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, archiveName);
}
