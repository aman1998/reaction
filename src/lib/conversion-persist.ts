import {
  db,
  type PersistedConversionItem,
} from "@/lib/db";
import type { ConversionView, QueueItem } from "@/stores/conversion-store";

const META_ACTIVE_ID = "activeId";
const META_VIEW = "view";

export type ConversionSession = {
  items: QueueItem[];
  activeId: string | null;
  view: ConversionView;
};

function persistedToQueueItem(item: PersistedConversionItem): QueueItem {
  return {
    id: item.id,
    fileName: item.fileName,
    stage: "done",
    componentName: item.componentName,
    svg: item.svg,
    jsx: item.jsx,
    tsx: item.tsx,
    previewDataUrl: item.previewDataUrl,
  };
}

export function queueItemToPersisted(item: QueueItem): PersistedConversionItem {
  return {
    id: item.id,
    fileName: item.fileName,
    componentName: item.componentName ?? "SvgIcon",
    svg: item.svg ?? "",
    jsx: item.jsx ?? "",
    tsx: item.tsx ?? "",
    previewDataUrl: item.previewDataUrl,
    createdAt: Date.now(),
  };
}

export async function loadConversionSession(): Promise<ConversionSession> {
  const rows = await db.conversionItems.orderBy("createdAt").toArray();
  const metaRows = await db.meta.toArray();
  const meta = new Map(metaRows.map((row) => [row.key, row.value]));

  const items = rows.map(persistedToQueueItem);
  const activeId = meta.get(META_ACTIVE_ID) ?? items.at(-1)?.id ?? null;
  const storedView = meta.get(META_VIEW);
  const view: ConversionView =
    storedView === "result" || storedView === "upload" || storedView === "processing"
      ? storedView
      : items.length > 0
        ? "result"
        : "upload";

  return {
    items,
    activeId,
    view: items.length > 0 ? (view === "upload" ? "result" : view) : "upload",
  };
}

export async function saveConversionItem(item: QueueItem): Promise<void> {
  if (
    item.stage !== "done" ||
    !item.svg ||
    !item.jsx ||
    !item.tsx ||
    !item.componentName
  ) {
    return;
  }

  const existing = await db.conversionItems.get(item.id);

  await db.conversionItems.put({
    ...queueItemToPersisted(item),
    createdAt: existing?.createdAt ?? Date.now(),
  });
}

export async function saveSessionMeta(meta: {
  activeId: string | null;
  view: ConversionView;
}): Promise<void> {
  await db.meta.bulkPut([
    { key: META_ACTIVE_ID, value: meta.activeId ?? "" },
    { key: META_VIEW, value: meta.view },
  ]);
}

export async function clearConversionSession(): Promise<void> {
  await db.transaction("rw", db.conversionItems, db.meta, async () => {
    await db.conversionItems.clear();
    await db.meta.clear();
  });
}

export async function removePersistedItems(ids: string[]): Promise<void> {
  if (ids.length === 0) {
    return;
  }

  await db.conversionItems.bulkDelete(ids);
}
