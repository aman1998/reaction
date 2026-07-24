"use client";

import { Check, Copy, LoaderCircle } from "lucide-react";
import { useState } from "react";

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
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} disabled={!tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="p-0">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-sm text-muted-foreground">
                {tab.value ? `${tab.value.length} characters` : "Not available"}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!tab.value || isRetransforming}
                onClick={() => handleCopy(tab.id, tab.value)}
              >
                {copiedTab === tab.id ? <Check /> : <Copy />}
                {copiedTab === tab.id ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="max-h-[420px] overflow-auto p-4 font-mono text-sm leading-6">
              <code>{tab.value ?? "Generate a component to view code."}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
