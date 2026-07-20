"use client";

import { ChevronDown, LoaderCircle } from "lucide-react";

import { useConversion } from "@/components/conversion/ConversionContext";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

function stageLabel(stage: string | undefined): string {
  switch (stage) {
    case "vectorizing":
      return "векторизация";
    case "generating":
      return "генерация компонента";
    case "done":
      return "готово";
    case "error":
      return "ошибка";
    default:
      return "ожидание";
  }
}

export function ProcessingQueuePopover() {
  const { queue, isBusy } = useConversion();

  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
        aria-label="Очередь обработки"
      >
        <ChevronDown className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(92vw,360px)] p-4">
        <PopoverHeader className="flex-row items-center justify-between gap-2">
          <PopoverTitle>очередь обработки</PopoverTitle>
          <Badge variant="secondary">MVP</Badge>
        </PopoverHeader>

        {!queue || queue.stage === "idle" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
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
              тут пока что ничего нет, только мы вдвоём. попробуй загрузить
              изображение!
            </PopoverDescription>
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/20 p-3">
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
                {queue.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={queue.previewUrl}
                    alt={queue.fileName}
                    className="size-full object-cover"
                  />
                ) : isBusy ? (
                  <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-medium">{queue.fileName}</p>
                <p className="text-base text-muted-foreground">
                  {stageLabel(queue.stage)}
                </p>
                {queue.error ? (
                  <p className="mt-2 text-base text-destructive">{queue.error}</p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
