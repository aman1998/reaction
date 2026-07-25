import type { Metadata } from "next";

import { GenerationOptions } from "@/components/style/GenerationOptions";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Style Settings",
  description:
    "Configure component generation options: currentColor, component style presets, and file naming conventions for SVG, JSX, and TSX export.",
  path: "/style",
  keywords: [
    "react component style",
    "svg currentColor",
    "tsx naming convention",
    "jsx export settings",
  ],
});

export default function StylePage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-semibold">Style</h1>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-medium">Component generation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Options apply to the next conversion and update existing results
          </p>
        </div>
        <GenerationOptions />
      </section>
    </div>
  );
}
