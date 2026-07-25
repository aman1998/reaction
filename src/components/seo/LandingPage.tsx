import { ConversionCenter } from "@/components/conversion/ConversionCenter";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingSeoSection } from "@/components/seo/LandingSeoSection";
import type { LandingPageConfig } from "@/lib/seo/landing-pages";

type LandingPageProps = {
  config: LandingPageConfig;
};

export function LandingPage({ config }: LandingPageProps) {
  return (
    <>
      <ConversionCenter />
      <LandingSeoSection config={config} />
      <JsonLd faq={config.faq} path={config.path} />
    </>
  );
}
