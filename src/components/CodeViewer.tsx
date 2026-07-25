"use client";

import { Check, Copy, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { StyleSettingsDrawer } from "@/components/style/StyleSettingsDrawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CodeViewerProps = {
  svg: string | null;
  jsx: string | null;
  tsx: string | null;
  isRetransforming?: boolean;
};

type CodeTab = "svg" | "jsx" | "tsx";

async function copyToClipboard(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function CodeViewer({
  svg,
  jsx,
  tsx,
  isRetransforming = false,
}: CodeViewerProps) {
  const [copiedTab, setCopiedTab] = useState<CodeTab | null>(null);

  const tabs: Array<{ id: CodeTab; label: string; value: string | null }> = [
    { id: "svg", label: "SVG", value: svg },
    { id: "jsx", label: "JSX", value: jsx },
    { id: "tsx", label: "TSX", value: tsx },
  ];

  const handleCopy = async (tab: CodeTab, value: string | null) => {
    if (!value) {
      return;
    }

    await copyToClipboard(value);
    setCopiedTab(tab);
    window.setTimeout(() => setCopiedTab(null), 1500);
  };

  if (!svg && !jsx && !tsx) {
    return null;
  }

  return (
    <div className="relative rounded-xl border bg-card">
      {isRetransforming ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-[1px]">
          <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : null}

      <Tabs defaultValue="tsx">
        <div className="flex flex-col gap-2 border-b px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="w-full min-w-0 overflow-x-auto">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} disabled={!tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="self-end sm:self-auto">
            <StyleSettingsDrawer />
          </div>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="p-0">
            <div className="flex items-center justify-between gap-2 border-b px-3 py-2 sm:px-4">
              <span className="text-xs text-muted-foreground sm:text-sm">
                {tab.value ? `${tab.value.length} characters` : "Not available"}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!tab.value || isRetransforming}
                onClick={() => handleCopy(tab.id, tab.value)}
                className="shrink-0"
              >
                {copiedTab === tab.id ? <Check /> : <Copy />}
                <span className="sr-only sm:not-sr-only">
                  {copiedTab === tab.id ? "Copied" : "Copy"}
                </span>
              </Button>
            </div>
            <pre className="max-h-[280px] overflow-auto p-3 font-mono text-xs leading-6 sm:max-h-[420px] sm:p-4 sm:text-sm">
              <code>{tab.value ?? "Generate a component to view code."}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
