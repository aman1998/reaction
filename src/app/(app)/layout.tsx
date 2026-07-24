import { AppShell } from "@/components/layout/AppShell";
import { ConversionHydrator } from "@/components/conversion/ConversionHydrator";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell>
      <ConversionHydrator>{children}</ConversionHydrator>
    </AppShell>
  );
}
