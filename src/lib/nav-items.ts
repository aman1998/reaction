import { Download, Palette, Settings } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const TOP_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Download", icon: Download },
  { href: "/style", label: "Style", icon: Palette },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export const ALL_NAV_ITEMS: NavItem[] = [
  ...TOP_NAV_ITEMS,
  ...BOTTOM_NAV_ITEMS,
];
