"use client";

import { Archive, ChevronDown, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  downloadComponentsZip,
  type ZipExportFormat,
} from "@/lib/download-zip";
import { useSettingsStore } from "@/stores/settings-store";
import type { QueueItem } from "@/stores/conversion-store";

type DownloadZipMenuProps = {
  items: QueueItem[];
  disabled?: boolean;
};

const FORMAT_OPTIONS: { format: ZipExportFormat; label: string }[] = [
  { format: "tsx", label: ".tsx" },
  { format: "jsx", label: ".jsx" },
  { format: "svg", label: ".svg" },
];

export function DownloadZipMenu({ items, disabled }: DownloadZipMenuProps) {
  const [isZipping, setIsZipping] = useState(false);
  const [open, setOpen] = useState(false);
  const namingConvention = useSettingsStore((state) => state.namingConvention);

  const handleDownload = (format: ZipExportFormat) => {
    setOpen(false);
    setIsZipping(true);
    void downloadComponentsZip(items, format, namingConvention).finally(() => {
      setIsZipping(false);
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        disabled={disabled || isZipping}
        render={<Button type="button" variant="outline" className="gap-1.5" />}
      >
        {isZipping ? <LoaderCircle className="animate-spin" /> : <Archive />}
        Download ZIP
        <ChevronDown className="size-4 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Export format</DropdownMenuLabel>
          {FORMAT_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleDownload(option.format)}
              className="justify-end"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDownload("all")}>
          All formats (tsx, jsx, svg folders)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
