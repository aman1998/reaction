import JSZip from "jszip";

import type { QueueItem } from "@/stores/conversion-store";

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadComponentsZip(
  items: QueueItem[],
  archiveName = "imagetodev-components.zip",
): Promise<void> {
  const doneItems = items.filter(
    (item) =>
      item.stage === "done" && item.svg && item.jsx && item.tsx && item.componentName,
  );

  if (doneItems.length === 0) {
    return;
  }

  const zip = new JSZip();
  const usedNames = new Map<string, number>();

  for (const item of doneItems) {
    const baseName = item.componentName!;
    const count = usedNames.get(baseName) ?? 0;
    usedNames.set(baseName, count + 1);
    const uniqueName = count === 0 ? baseName : `${baseName}_${count + 1}`;

    zip.file(`${uniqueName}.svg`, item.svg!);
    zip.file(`${uniqueName}.jsx`, item.jsx!);
    zip.file(`${uniqueName}.tsx`, item.tsx!);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, archiveName);
}
