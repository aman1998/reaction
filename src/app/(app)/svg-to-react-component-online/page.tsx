import type { Metadata } from "next";

import { LandingPage } from "@/components/seo/LandingPage";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getLandingPage } from "@/lib/seo/landing-pages";

const config = getLandingPage("svg-to-react-component-online");

export const metadata: Metadata = createPageMetadata({
  title: config.title,
  description: config.description,
  path: config.path,
  keywords: config.keywords,
});

export default function SvgToReactComponentOnlinePage() {
  return <LandingPage config={config} />;
}
