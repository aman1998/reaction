import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t px-4 py-4 text-center text-sm text-muted-foreground">
      продолжая, ты соглашаешься с{" "}
      <Link href="/terms" className="underline underline-offset-4">
        условиями использования
      </Link>
    </footer>
  );
}
