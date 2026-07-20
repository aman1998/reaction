"use client";

import { ProcessingQueuePopover } from "@/components/ProcessingQueuePopover";
import { SupportedFormatsPopover } from "@/components/SupportedFormatsPopover";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppHeader() {
  return (
    <header className="relative flex h-14 items-center justify-end px-4">
      <div className="absolute left-1/2 -translate-x-1/2">
        <SupportedFormatsPopover />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle variant="icon" />
        <ProcessingQueuePopover />
      </div>
    </header>
  );
}
