import { GenerationOptions } from "@/components/style/GenerationOptions";

export default function StylePage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-semibold">Style</h1>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-medium">Component generation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Options apply to the next conversion and update existing results
          </p>
        </div>
        <GenerationOptions />
      </section>
    </div>
  );
}
