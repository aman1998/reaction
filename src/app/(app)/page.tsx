import type { Metadata } from "next";

import { ConversionCenter } from "@/components/conversion/ConversionCenter";
import { HomeHero } from "@/components/seo/HomeHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { HOME_FAQ } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Image to React Component Converter",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ConversionCenter />
      <JsonLd faq={HOME_FAQ} path="/" />
    </>
  );
}
