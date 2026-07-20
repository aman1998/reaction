import { GenerationOptions } from "@/components/settings/GenerationOptions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-semibold">Настройки</h1>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-medium">Тема</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Переключение светлой и тёмной темы
          </p>
        </div>
        <ThemeToggle />
      </section>

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
