import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Info",
  path: "/info",
  noindex: true,
});

export default function InfoPage() {
  return <h1 className="text-2xl font-semibold">Info</h1>;
}
