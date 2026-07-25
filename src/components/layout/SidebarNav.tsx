"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/brand/AppLogo";
import {
  BOTTOM_NAV_ITEMS,
  TOP_NAV_ITEMS,
  type NavItem,
} from "@/lib/nav-items";
import { cn } from "@/lib/utils";

function NavButton({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex w-[80px] flex-col items-center gap-[3px] rounded-xl px-2 py-2.5 text-sm text-muted-foreground transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-5.5" />
      <span className="text-xs">{item.label}</span>
    </Link>
  );
}

export function SidebarNav() {
  return (
    <aside className="hidden h-dvh w-[90px] shrink-0 flex-col overflow-hidden border-r bg-background md:flex">
      <div className="flex shrink-0 flex-col items-center gap-[2px] py-4">
        <AppLogo className="mb-2" />
        {TOP_NAV_ITEMS.map((item) => (
          <NavButton key={item.href} item={item} />
        ))}
      </div>

      <div className="mt-auto flex shrink-0 flex-col items-center gap-2 px-3 py-4">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavButton key={item.href} item={item} />
        ))}
      </div>
    </aside>
  );
}
