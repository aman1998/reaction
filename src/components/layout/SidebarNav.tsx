"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsRight,
  Download,
  Heart,
  Info,
  Settings,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const topItem: NavItem = {
  href: "/",
  label: "скачать",
  icon: Download,
};

const bottomItems: NavItem[] = [
  { href: "/settings", label: "настройки", icon: Settings },
  { href: "/donations", label: "донаты", icon: Heart },
  { href: "/news", label: "новости", icon: Sparkles },
  { href: "/info", label: "инфо", icon: Info },
];

function NavButton({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex w-[72px] flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-sm text-muted-foreground transition-colors",
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
    <aside className="flex min-h-full w-[96px] shrink-0 flex-col border-r bg-background">
      <div className="flex flex-col items-center gap-2 px-3 py-4">
        <ChevronsRight
          className="size-5 text-muted-foreground"
          aria-hidden
        />
        <NavButton item={topItem} />
      </div>

      <div className="mt-auto flex flex-col items-center gap-2 px-3 py-4">
        {bottomItems.map((item) => (
          <NavButton key={item.href} item={item} />
        ))}
      </div>
    </aside>
  );
}
