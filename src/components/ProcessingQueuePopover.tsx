"use client";

import { ChevronDown, LoaderCircle } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { RemoveQueueItemDialog } from "@/components/conversion/RemoveQueueItemDialog";
import { useConversion } from "@/stores/use-conversion";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function stageLabel(stage: string | undefined): string {
  switch (stage) {
    case "vectorizing":
      return "Vectorizing";
    case "generating":
      return "Generating component";
    case "done":
      return "Done";
    case "error":
      return "Error";
    case "idle":
      return "Waiting";
    default:
      return "Waiting";
  }
}

export function ProcessingQueuePopover() {
  const {
    queue,
    isBusy,
    activeId,
    selectItem,
    removeItem,
    doneCount,
    totalCount,
  } = useConversion();
  const [open, setOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollItemIntoView = useCallback((id: string) => {
    if (!scrollContainerRef.current) {
      return;
    }

    const element = scrollContainerRef.current.querySelector(
      `[data-queue-item-id="${id}"]`,
    );

    if (element instanceof HTMLElement) {
      element.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, []);

  const scrollActiveIntoView = useCallback(() => {
    if (!activeId) {
      return;
    }

    scrollItemIntoView(activeId);
  }, [activeId, scrollItemIntoView]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    scrollActiveIntoView();

    const timeoutId = window.setTimeout(scrollActiveIntoView, 0);
    return () => window.clearTimeout(timeoutId);
  }, [open, activeId, scrollActiveIntoView]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-2.5 text-foreground transition-colors hover:bg-muted"
        aria-label="Processing queue"
      >
        <ChevronDown className="size-4" />
        {totalCount > 0 ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            {doneCount}/{totalCount}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(92vw,360px)] overflow-hidden p-0"
      >
        <PopoverHeader className="flex-row items-center justify-between gap-2 px-4 pt-4 pb-2">
          <PopoverTitle>Processing queue</PopoverTitle>
          {totalCount > 0 ? (
            <Badge variant="secondary">
              {doneCount}/{totalCount}
            </Badge>
          ) : null}
        </PopoverHeader>

        {queue.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 pb-4 py-6 text-center">
            <div className="text-muted-foreground">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                aria-hidden
              >
                <path
                  d="M40 14c-5 0-9 4-9 9v1c-7 1-12 7-12 14 0 8 7 15 15 15h12c8 0 15-7 15-15 0-7-5-13-12-14v-1c0-5-4-9-9-9Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <circle cx="33" cy="36" r="2.5" fill="currentColor" />
                <circle cx="47" cy="36" r="2.5" fill="currentColor" />
              </svg>
            </div>
            <PopoverDescription className="max-w-[240px] text-center">
              Nothing here yet. Upload an image to get started.
            </PopoverDescription>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="queue-scrollbar max-h-[320px] overflow-y-auto pl-4 pr-0 pb-4"
          >
            <div className="flex flex-col gap-2 pr-4">
              {queue.map((item) => {
              const isActive = item.id === activeId;
              const isSelectable = item.stage === "done";
              const isItemBusy =
                item.stage === "vectorizing" || item.stage === "generating";
              const canRemove = !isItemBusy;
              const previewSrc = item.previewUrl ?? item.previewDataUrl;

              return (
                <div
                  key={item.id}
                  data-queue-item-id={item.id}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg border bg-muted/20 p-3",
                    isActive && "border-primary bg-primary/5 scroll-mt-2",
                  )}
                >
                  <button
                    type="button"
                    disabled={!isSelectable}
                    onClick={() => {
                      selectItem(item.id);
                      scrollItemIntoView(item.id);
                    }}
                    className={cn(
                      "min-w-0 flex-1 text-left transition-colors",
                      isSelectable && "hover:opacity-80",
                      !isSelectable && "cursor-default",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
                        {previewSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewSrc}
                            alt={item.fileName}
                            className="size-full object-cover"
                          />
                        ) : isItemBusy || (isBusy && item.stage === "idle") ? (
                          <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-medium">
                          {item.fileName}
                        </p>
                        <p className="text-base text-muted-foreground">
                          {stageLabel(item.stage)}
                        </p>
                        {item.error ? (
                          <p className="mt-2 text-base text-destructive">
                            {item.error}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </button>

                  <RemoveQueueItemDialog
                    fileName={item.fileName}
                    disabled={!canRemove}
                    onConfirm={() => removeItem(item.id)}
                  />
                </div>
              );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
