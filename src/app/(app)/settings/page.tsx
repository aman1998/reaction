import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-medium">Theme</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Switch between light and dark mode
          </p>
        </div>
        <ThemeToggle />
      </section>
    </div>
  );
}
