"use client";

type PreviewProps = {
  originalPreview: string | null;
  svg: string | null;
  fileName: string | null;
};

export function Preview({ originalPreview, svg, fileName }: PreviewProps) {
  if (!originalPreview && !svg) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 text-base font-medium">Original</h3>
        <div className="flex min-h-48 items-center justify-center rounded-lg border bg-muted/30 p-6">
          {originalPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={originalPreview}
              alt={fileName ?? "Original preview"}
              className="max-h-48 max-w-full object-contain"
            />
          ) : (
            <p className="text-base text-muted-foreground">No preview</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 text-base font-medium">SVG Preview</h3>
        <div className="flex min-h-48 items-center justify-center rounded-lg border bg-muted/30 p-6">
          {svg ? (
            <div
              className="max-h-48 max-w-full [&_svg]:h-auto [&_svg]:max-h-48 [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <p className="text-base text-muted-foreground">No SVG yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
