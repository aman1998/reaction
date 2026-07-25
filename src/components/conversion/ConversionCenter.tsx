"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { HeroIllustration } from "@/components/brand/HeroIllustration";
import { ClearQueueDialog } from "@/components/conversion/ClearQueueDialog";
import { DownloadZipMenu } from "@/components/conversion/DownloadZipMenu";
import { useConversion } from "@/stores/use-conversion";
import { CodeViewer } from "@/components/CodeViewer";
import { DownloadButtons } from "@/components/DownloadButtons";
import { Dropzone } from "@/components/Dropzone";
import { Preview } from "@/components/Preview";
import { Button } from "../ui/button";

const FILE_LIST_LIMIT = 30;

export function ConversionCenter() {
  const [showAllFiles, setShowAllFiles] = useState(false);
  const {
    view,
    queue,
    activeItem,
    processingItem,
    doneCount,
    totalCount,
    error,
    isBusy,
    isRetransforming,
    convertFiles,
    selectItem,
    clear,
  } = useConversion();

  if (view === "processing") {
    const label =
      processingItem?.stage === "generating"
        ? "Generating component..."
        : "Vectorizing...";

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
              {doneCount} of {totalCount}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (view === "result" && activeItem) {
    const showBatchControls = totalCount > 1;
    const visibleQueue = showAllFiles ? queue : queue.slice(0, FILE_LIST_LIMIT);
    const hiddenFileCount = queue.length - FILE_LIST_LIMIT;

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base font-medium">Done</p>
            <p className="text-base text-muted-foreground">
              {activeItem.fileName}
              {showBatchControls ? ` · ${doneCount} of ${totalCount}` : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {showBatchControls && doneCount > 0 ? (
              <DownloadZipMenu items={queue} disabled={doneCount === 0} />
            ) : null}
            <ClearQueueDialog onConfirm={clear} />
          </div>
        </div>

        {showBatchControls ? (
          <div className="flex flex-wrap gap-2">
            {visibleQueue.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant={item.id === activeItem.id ? "default" : "outline"}
                size="lg"
                disabled={item.stage !== "done"}
                onClick={() => selectItem(item.id)}
              >
                {item.stage === "vectorizing" || item.stage === "generating" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <LoaderCircle className="size-3.5 animate-spin" />
                    {item.fileName}
                  </span>
                ) : (
                  item.fileName
                )}
              </Button>
            ))}
            {!showAllFiles && hiddenFileCount > 0 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAllFiles(true)}
                size="lg"
              >
                Show {hiddenFileCount} more
              </Button>
            ) : null}
          </div>
        ) : null}

        <Preview
          originalPreview={
            activeItem.previewUrl ?? activeItem.previewDataUrl ?? null
          }
          svg={activeItem.svg ?? null}
          fileName={activeItem.fileName}
        />

        <CodeViewer
          svg={activeItem.svg ?? null}
          jsx={activeItem.jsx ?? null}
          tsx={activeItem.tsx ?? null}
          isRetransforming={isRetransforming}
        />

        <DownloadButtons
          fileName={activeItem.fileName}
          svg={activeItem.svg ?? null}
          jsx={activeItem.jsx ?? null}
          tsx={activeItem.tsx ?? null}
        />

        <Dropzone disabled={isBusy} onFilesSelect={convertFiles} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 pt-10">
      <HeroIllustration />

      <div className="max-w-md text-center">
        <p className="text-lg font-medium">Turn images into React components</p>
        <p className="mt-2 text-base text-muted-foreground">
          Upload an icon or image — get optimized SVG and ready-to-use JSX or
          TSX in one step. No manual vectorization or separate tools.
        </p>
      </div>

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
