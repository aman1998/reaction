"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import { transformAction } from "@/app/actions/transform";
import { toComponentName } from "@/lib/image-utils";
import { processImageClient } from "@/lib/process-client";
import type { ConvertOptions } from "@/lib/types";

export type QueueStage =
  | "idle"
  | "vectorizing"
  | "generating"
  | "done"
  | "error";

export type QueueItem = {
  fileName: string;
  stage: QueueStage;
  error?: string;
  previewUrl?: string;
};

export type ConversionView = "upload" | "processing" | "result";

type ConversionContextValue = {
  view: ConversionView;
  queue: QueueItem | null;
  originalPreview: string | null;
  svg: string | null;
  jsx: string | null;
  tsx: string | null;
  componentName: string | null;
  error: string | null;
  isBusy: boolean;
  convert: (file: File) => void;
  reset: () => void;
};

const defaultOptions: Required<ConvertOptions> = {
  componentName: "",
  currentColor: true,
  forwardRef: true,
  memo: false,
};

const ConversionContext = createContext<ConversionContextValue | null>(null);

export function ConversionProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ConversionView>("upload");
  const [queue, setQueue] = useState<QueueItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [jsx, setJsx] = useState<string | null>(null);
  const [tsx, setTsx] = useState<string | null>(null);
  const [componentName, setComponentName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (originalPreview) {
        URL.revokeObjectURL(originalPreview);
      }
    };
  }, [originalPreview]);

  const reset = useCallback(() => {
    setView("upload");
    setQueue(null);
    setError(null);
    setSvg(null);
    setJsx(null);
    setTsx(null);
    setComponentName(null);

    setOriginalPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return null;
    });
  }, []);

  const convert = useCallback(
    (file: File) => {
      const nextComponentName = toComponentName(file.name);

      setError(null);
      setSvg(null);
      setJsx(null);
      setTsx(null);
      setComponentName(nextComponentName);
      setView("processing");
      setQueue({
        fileName: file.name,
        stage: "vectorizing",
      });

      startTransition(async () => {
        try {
          const clientResult = await processImageClient(file, {
            componentName: nextComponentName,
          });

          setOriginalPreview((current) => {
            if (current) {
              URL.revokeObjectURL(current);
            }

            return clientResult.originalPreview;
          });
          setSvg(clientResult.svg);
          setComponentName(clientResult.componentName);
          setQueue({
            fileName: file.name,
            stage: "generating",
            previewUrl: clientResult.originalPreview,
          });

          const transformResult = await transformAction({
            svg: clientResult.svg,
            fileName: file.name,
            options: {
              componentName: clientResult.componentName,
              currentColor: defaultOptions.currentColor,
              forwardRef: defaultOptions.forwardRef,
              memo: defaultOptions.memo,
            },
          });

          if ("error" in transformResult) {
            throw new Error(transformResult.error);
          }

          setJsx(transformResult.jsx);
          setTsx(transformResult.tsx);
          setComponentName(transformResult.componentName);
          setView("result");
          setQueue({
            fileName: file.name,
            stage: "done",
            previewUrl: clientResult.originalPreview,
          });
        } catch (conversionError) {
          const message =
            conversionError instanceof Error
              ? conversionError.message
              : "Conversion failed.";

          setError(message);
          setView("upload");
          setQueue({
            fileName: file.name,
            stage: "error",
            error: message,
          });
        }
      });
    },
    [startTransition],
  );

  const value = useMemo(
    () => ({
      view,
      queue,
      originalPreview,
      svg,
      jsx,
      tsx,
      componentName,
      error,
      isBusy:
        isPending || queue?.stage === "vectorizing" || queue?.stage === "generating",
      convert,
      reset,
    }),
    [
      view,
      queue,
      originalPreview,
      svg,
      jsx,
      tsx,
      componentName,
      error,
      isPending,
      convert,
      reset,
    ],
  );

  return (
    <ConversionContext.Provider value={value}>
      {children}
    </ConversionContext.Provider>
  );
}

export function useConversion() {
  const context = useContext(ConversionContext);

  if (!context) {
    throw new Error("useConversion must be used within ConversionProvider.");
  }

  return context;
}
