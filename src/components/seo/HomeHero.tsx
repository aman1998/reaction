"use client";

import { useConversionStore } from "@/stores/conversion-store";

export function HomeHero() {
  const view = useConversionStore((state) => state.view);

  if (view !== "upload") {
    return null;
  }

  return (
    <header className="mx-auto mb-4 flex w-full max-w-xl flex-col items-center gap-4 text-center sm:mb-8">
      <h1 className="text-base font-medium sm:text-lg">
        Turn images into React components
      </h1>
      <p className="max-w-md text-base text-muted-foreground">
        Upload an icon or image — get optimized SVG and ready-to-use JSX or TSX
        in one step. No manual vectorization or separate tools.
      </p>
    </header>
  );
}
