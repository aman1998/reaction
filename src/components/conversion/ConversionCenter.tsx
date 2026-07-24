"use client";

import { Archive, LoaderCircle, RotateCcw } from "lucide-react";
import { useState } from "react";

import { HeroIllustration } from "@/components/brand/HeroIllustration";
import { useConversion } from "@/stores/use-conversion";
import { CodeViewer } from "@/components/CodeViewer";
import { DownloadButtons } from "@/components/DownloadButtons";
import { Dropzone } from "@/components/Dropzone";
import { Preview } from "@/components/Preview";
import { Button } from "@/components/ui/button";
import { downloadComponentsZip } from "@/lib/download-zip";
import { cn } from "@/lib/utils";

export function ConversionCenter() {
  const {
    view,
    queue,
    activeItem,
    processingItem,
    doneCount,
    totalCount,
    error,
    isBusy,
    convertFiles,
    selectItem,
    reset,
  } = useConversion();
  const [isZipping, setIsZipping] = useState(false);

  if (view === "processing") {
    const label =
      processingItem?.stage === "generating"
        ? "Генерация компонента..."
        : "Векторизация...";

    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 py-24 text-center">
        <LoaderCircle className="size-10 animate-spin text-muted-foreground" />
        <div>
          <p className="text-base font-medium">{label}</p>
          {processingItem?.fileName ? (
            <p className="mt-1 text-base text-muted-foreground">
              {processingItem.fileName}
            </p>
          ) : null}
          {totalCount > 1 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {doneCount} из {totalCount}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (view === "result" && activeItem) {
    const showBatchControls = totalCount > 1;

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base font-medium">Готово</p>
            <p className="text-base text-muted-foreground">
              {activeItem.fileName}
              {showBatchControls
                ? ` · ${doneCount} из ${totalCount}`
                : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {showBatchControls && doneCount > 0 ? (
              <Button
                type="button"
                variant="outline"
                disabled={isZipping || doneCount === 0}
                onClick={() => {
                  setIsZipping(true);
                  void downloadComponentsZip(queue).finally(() => {
                    setIsZipping(false);
                  });
                }}
              >
                {isZipping ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Archive />
                )}
                Download ZIP
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={reset}>
              <RotateCcw />
              Загрузить ещё
            </Button>
          </div>
        </div>

        {showBatchControls ? (
          <div className="flex flex-wrap gap-2">
            {queue.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={item.stage !== "done"}
                onClick={() => selectItem(item.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  item.id === activeItem.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : item.stage === "done"
                      ? "hover:bg-muted"
                      : "cursor-not-allowed opacity-50",
                )}
              >
                {item.stage === "vectorizing" || item.stage === "generating" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <LoaderCircle className="size-3.5 animate-spin" />
                    {item.fileName}
                  </span>
                ) : (
                  item.fileName
                )}
              </button>
            ))}
          </div>
        ) : null}

        <Preview
          originalPreview={activeItem.previewUrl ?? null}
          svg={activeItem.svg ?? null}
          fileName={activeItem.fileName}
        />

        <CodeViewer
          svg={activeItem.svg ?? null}
          jsx={activeItem.jsx ?? null}
          tsx={activeItem.tsx ?? null}
        />

        <DownloadButtons
          svg={activeItem.svg ?? null}
          jsx={activeItem.jsx ?? null}
          tsx={activeItem.tsx ?? null}
          componentName={activeItem.componentName ?? null}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 pt-10">
      <HeroIllustration />

      <div className="w-full">
        <Dropzone disabled={isBusy} onFilesSelect={convertFiles} />

        {error ? (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-base text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
