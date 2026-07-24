"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  variant?: "default" | "icon";
  className?: string;
};

export function ThemeToggle({
  variant = "default",
  className,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("rounded-full", className)}
        aria-label={isDark ? "Light theme" : "Dark theme"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun /> : <Moon />}
      {isDark ? "Light theme" : "Dark theme"}
    </Button>
  );
}
