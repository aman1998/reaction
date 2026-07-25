import type { Metadata } from "next";

import { LandingPage } from "@/components/seo/LandingPage";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getLandingPage } from "@/lib/seo/landing-pages";

const config = getLandingPage("image-to-tsx");

export const metadata: Metadata = createPageMetadata({
  title: config.title,
  description: config.description,
  path: config.path,
  keywords: config.keywords,
});

export default function ImageToTsxPage() {
  return <LandingPage config={config} />;
}
