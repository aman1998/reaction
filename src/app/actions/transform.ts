"use server";

import { toComponentName } from "@/lib/image-utils";
import { transformToReact } from "@/lib/transform";
import {
  MAX_SVG_SIZE,
  type TransformActionInput,
  type TransformActionResult,
} from "@/lib/types";

export async function transformAction(
  input: TransformActionInput,
): Promise<TransformActionResult> {
  try {
    const { svg, fileName, options } = input;

    if (!svg.trim()) {
      return { error: "SVG content is empty." };
    }

    if (svg.length > MAX_SVG_SIZE) {
      return { error: "Optimized SVG is too large to transform." };
    }

    if (!svg.includes("<svg")) {
      return { error: "Invalid SVG content." };
    }

    const componentName = options.componentName ?? toComponentName(fileName);
    const { jsx, tsx } = await transformToReact(svg, fileName, {
      ...options,
      componentName,
    });

    return {
      jsx,
      tsx,
      componentName,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to transform SVG into a React component.",
    };
  }
}
