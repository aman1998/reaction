import Link from "next/link";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Image to Dev"
      className={cn(
        "inline-flex text-foreground transition-colors hover:text-primary",
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-8"
        aria-hidden
      >
        <rect
          x="2"
          y="6"
          width="12"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="6" cy="10" r="1.25" fill="currentColor" />
        <path
          d="M4 16l3-3 2.5 2.5L11 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 12h4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M18 10l2 2-2 2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 8v8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M26 8v8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M22 12h4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
