import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "News",
  path: "/news",
  noindex: true,
});

export default function NewsPage() {
  return <h1 className="text-2xl font-semibold">News</h1>;
}
