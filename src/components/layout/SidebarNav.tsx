"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Heart, Info, Palette, Settings, Sparkles } from "lucide-react";

import { AppLogo } from "@/components/brand/AppLogo";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const topItems: NavItem[] = [
  { href: "/", label: "скачать", icon: Download },
  { href: "/style", label: "стиль", icon: Palette },
];

const bottomItems: NavItem[] = [
  { href: "/donations", label: "донаты", icon: Heart },
  { href: "/news", label: "новости", icon: Sparkles },
  { href: "/info", label: "инфо", icon: Info },
  { href: "/settings", label: "настройки", icon: Settings },
];

function NavButton({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex w-[80px] flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-sm text-muted-foreground transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-6" />
      <span>{item.label}</span>
    </Link>
  );
}

export function SidebarNav() {
  return (
    <aside className="flex h-dvh w-[112px] shrink-0 flex-col overflow-hidden border-r bg-background">
      <div className="flex shrink-0 flex-col items-center gap-4 px-3 py-4">
        <AppLogo className="mb-2" />
        {topItems.map((item) => (
          <NavButton key={item.href} item={item} />
        ))}
      </div>

      <div className="mt-auto flex shrink-0 flex-col items-center gap-2 px-3 py-4">
        {bottomItems.map((item) => (
          <NavButton key={item.href} item={item} />
        ))}
      </div>
    </aside>
  );
}
