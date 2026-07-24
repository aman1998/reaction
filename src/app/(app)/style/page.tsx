import { GenerationOptions } from "@/components/style/GenerationOptions";

export default function StylePage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-semibold">Стиль</h1>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-medium">Генерация компонента</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Опции применяются к следующей конвертации
          </p>
        </div>
        <GenerationOptions />
      </section>
    </div>
  );
}
