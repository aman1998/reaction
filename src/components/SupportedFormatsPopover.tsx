"use client";

import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const FORMATS = ["PNG", "JPG", "JPEG", "WebP", "SVG"];

export function SupportedFormatsPopover() {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex max-w-full items-center gap-1.5 truncate text-sm text-muted-foreground transition-colors hover:text-foreground sm:text-base">
        <Plus className="size-4 shrink-0" />
        <span className="truncate">Supported formats</span>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-[min(92vw,420px)] p-4">
        <PopoverHeader>
          <PopoverTitle>Supported formats</PopoverTitle>
          <PopoverDescription>
            Up to 5 MB per file. Vectorization and SVG optimization run in the
            browser.
          </PopoverDescription>
        </PopoverHeader>

        <div className="flex flex-wrap gap-2">
          {FORMATS.map((format) => (
            <Badge key={format} variant="secondary">
              {format}
            </Badge>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
