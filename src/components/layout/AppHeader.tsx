"use client";

import { MobileNav } from "@/components/layout/MobileNav";
import { ProcessingQueuePopover } from "@/components/ProcessingQueuePopover";
import { SupportedFormatsPopover } from "@/components/SupportedFormatsPopover";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3 sm:px-4">
      <div className="flex min-w-0 items-center">
        <MobileNav />
      </div>

      <div className="flex min-w-0 flex-1 justify-center px-1">
        <SupportedFormatsPopover />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle variant="icon" />
        <ProcessingQueuePopover />
      </div>
    </header>
  );
}
