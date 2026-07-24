import Dexie, { type Table } from "dexie";

export type PersistedConversionItem = {
  id: string;
  fileName: string;
  componentName: string;
  svg: string;
  jsx: string;
  tsx: string;
  previewDataUrl?: string;
  createdAt: number;
};

type MetaRow = { key: string; value: string };

class ImagetodevDB extends Dexie {
  conversionItems!: Table<PersistedConversionItem, string>;
  meta!: Table<MetaRow, string>;

  constructor() {
    super("imagetodev");
    this.version(1).stores({
      conversionItems: "id, createdAt",
      meta: "key",
    });
  }
}

export const db = new ImagetodevDB();
