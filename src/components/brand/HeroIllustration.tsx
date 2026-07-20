import { cn } from "@/lib/utils";

type HeroIllustrationProps = {
  className?: string;
};

export function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-36 w-auto text-muted-foreground sm:h-40", className)}
      aria-hidden
    >
      <rect
        x="18"
        y="28"
        width="52"
        height="52"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="30" cy="40" r="3" fill="currentColor" />
      <path
        d="M26 68l10-10 8 8 12-14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M82 54h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path
        d="M88 48l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="112"
        y="24"
        width="70"
        height="60"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M122 40h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M122 52h28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M122 64h22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M148 34v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M154 34v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M148 40h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M44 92c8 10 18 14 28 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="56" cy="108" r="2" fill="currentColor" opacity="0.45" />
      <circle cx="72" cy="112" r="2" fill="currentColor" opacity="0.45" />
      <circle cx="88" cy="110" r="2" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
