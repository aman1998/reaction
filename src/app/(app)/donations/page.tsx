import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Donations",
  path: "/donations",
  noindex: true,
});

export default function DonationsPage() {
  return <h1 className="text-2xl font-semibold">Donations</h1>;
}
