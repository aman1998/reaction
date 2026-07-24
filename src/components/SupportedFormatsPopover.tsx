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
      <PopoverTrigger className="inline-flex items-center gap-1.5 text-base text-muted-foreground transition-colors hover:text-foreground">
        <Plus className="size-4" />
        Supported formats
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
