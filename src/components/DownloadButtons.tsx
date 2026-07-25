"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toFileBaseName } from "@/lib/image-utils";
import { useSettingsStore } from "@/stores/settings-store";

type DownloadButtonsProps = {
  fileName: string;
  svg: string | null;
  jsx: string | null;
  tsx: string | null;
};

function downloadTextFile(
  content: string,
  fileName: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function DownloadButtons({
  fileName,
  svg,
  jsx,
  tsx,
}: DownloadButtonsProps) {
  const namingConvention = useSettingsStore((state) => state.namingConvention);
  const baseName = toFileBaseName(fileName, namingConvention);

  if (!svg && !jsx && !tsx) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        variant="outline"
        disabled={!svg}
        className="w-full sm:w-auto"
        onClick={() => svg && downloadTextFile(svg, `${baseName}.svg`, "image/svg+xml")}
      >
        <Download />
        Download SVG
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={!jsx}
        className="w-full sm:w-auto"
        onClick={() =>
          jsx && downloadTextFile(jsx, `${baseName}.jsx`, "text/javascript")
        }
      >
        <Download />
        Download JSX
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={!tsx}
        className="w-full sm:w-auto"
        onClick={() =>
          tsx && downloadTextFile(tsx, `${baseName}.tsx`, "text/typescript")
        }
      >
        <Download />
        Download TSX
      </Button>
    </div>
  );
}
