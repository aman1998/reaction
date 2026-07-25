import type { LandingPageConfig } from "@/lib/seo/landing-pages";

type LandingSeoSectionProps = {
  config: LandingPageConfig;
};

export function LandingSeoSection({ config }: LandingSeoSectionProps) {
  return (
    <section className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-6 sm:mt-12 sm:gap-8">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {config.h1}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{config.intro}</p>
      </header>

      <div>
        <h2 className="text-base font-medium">Why use Image to Dev</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {config.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-base font-medium">Frequently asked questions</h2>
        <dl className="mt-3 flex flex-col gap-4">
          {config.faq.map((item) => (
            <div key={item.question}>
              <dt className="text-sm font-medium">{item.question}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
