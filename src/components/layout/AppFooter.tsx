import Link from "next/link";

import { cn } from "@/lib/utils";

export function AppFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "px-4 py-6 text-center text-xs text-muted-foreground",
        className,
      )}
    >
      {/* <nav
        aria-label="Footer navigation"
        className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-2"
      >
        {LANDING_PAGE_LINKS.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="underline-offset-4 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav> */}
      <p>
        By continuing, you agree to the{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>
      </p>
    </footer>
  );
}
