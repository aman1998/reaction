"use client";

import { ConversionProvider } from "@/components/conversion/ConversionContext";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { SidebarNav } from "@/components/layout/SidebarNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ConversionProvider>
      <div className="flex min-h-full">
        <SidebarNav />

        <div className="flex min-h-full min-w-0 flex-1 flex-col">
          <AppHeader />

          <main className="flex w-full flex-1 flex-col overflow-y-auto px-4 py-8">
            {children}
          </main>

          <AppFooter />
        </div>
      </div>
    </ConversionProvider>
  );
}
