import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="px-4 py-4 text-center text-xs text-muted-foreground">
      By continuing, you agree to the{" "}
      <Link href="/terms" className="underline underline-offset-4">
        Terms of Service
      </Link>
    </footer>
  );
}
