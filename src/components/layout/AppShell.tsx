"use client";

import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { SidebarNav } from "@/components/layout/SidebarNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <SidebarNav />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />

        <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
          {children}
        </main>

        <AppFooter className="pb-[max(1rem,env(safe-area-inset-bottom))]" />
      </div>
    </div>
  );
}
