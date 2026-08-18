import type { Metadata } from "next";

import { LandingPage } from "@/components/seo/LandingPage";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getLandingPage } from "@/lib/seo/landing-pages";

const config = getLandingPage("free-react-icon-converter");

export const metadata: Metadata = createPageMetadata({
  title: config.title,
  description: config.description,
  path: config.path,
  keywords: config.keywords,
});

export default function FreeReactIconConverterPage() {
  return <LandingPage config={config} />;
}
