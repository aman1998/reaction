"use client";

import { LoaderCircle, RotateCcw } from "lucide-react";

import { useConversion } from "@/components/conversion/ConversionContext";
import { CodeViewer } from "@/components/CodeViewer";
import { DownloadButtons } from "@/components/DownloadButtons";
import { Dropzone } from "@/components/Dropzone";
import { Preview } from "@/components/Preview";
import { Button } from "@/components/ui/button";

export function ConversionCenter() {
  const {
    view,
    queue,
    originalPreview,
    svg,
    jsx,
    tsx,
    componentName,
    error,
    isBusy,
    convert,
    reset,
  } = useConversion();

  if (view === "processing") {
    const label =
      queue?.stage === "generating"
        ? "Генерация компонента..."
        : "Векторизация...";

    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 py-24 text-center">
        <LoaderCircle className="size-10 animate-spin text-muted-foreground" />
        <div>
          <p className="text-base font-medium">{label}</p>
          {queue?.fileName ? (
            <p className="mt-1 text-base text-muted-foreground">{queue.fileName}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (view === "result") {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-medium">Готово</p>
            <p className="text-base text-muted-foreground">
              {queue?.fileName ?? componentName}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw />
            Загрузить ещё
          </Button>
        </div>

        <Preview
          originalPreview={originalPreview}
          svg={svg}
          fileName={queue?.fileName ?? null}
        />

        <CodeViewer svg={svg} jsx={jsx} tsx={tsx} />

        <DownloadButtons
          svg={svg}
          jsx={jsx}
          tsx={tsx}
          componentName={componentName}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl pt-16">
      <Dropzone disabled={isBusy} onFileSelect={convert} />

      {error ? (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-base text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}
