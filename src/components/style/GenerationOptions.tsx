"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CODE_FORMATTING_OPTIONS,
  getCodeFormattingLabel,
  isCodeFormatting,
} from "@/lib/code-formatting";
import {
  COMPONENT_STYLE_OPTIONS,
  getComponentStyleLabel,
  isComponentStyle,
} from "@/lib/component-style";
import {
  isNamingConvention,
  type NamingConvention,
} from "@/lib/image-utils";
import {
  getSvgOptimizationLabel,
  isSvgOptimization,
  SVG_OPTIMIZATION_OPTIONS,
} from "@/lib/svg-optimization";
import { useSettingsStore } from "@/stores/settings-store";

const NAMING_OPTIONS: {
  value: NamingConvention;
  label: string;
  example: string;
}[] = [
  { value: "pascalCase", label: "PascalCase", example: "ArrowRight" },
  { value: "camelCase", label: "camelCase", example: "arrowRight" },
  { value: "snakeCase", label: "snake_case", example: "arrow_right" },
  { value: "kebabCase", label: "kebab-case", example: "arrow-right" },
  {
    value: "screamingSnake",
    label: "SCREAMING_SNAKE",
    example: "ARROW_RIGHT",
  },
];

export function GenerationOptions() {
  const currentColor = useSettingsStore((state) => state.currentColor);
  const componentStyle = useSettingsStore((state) => state.componentStyle);
  const namingConvention = useSettingsStore((state) => state.namingConvention);
  const codeFormatting = useSettingsStore((state) => state.codeFormatting);
  const svgOptimization = useSettingsStore((state) => state.svgOptimization);
  const updateOption = useSettingsStore((state) => state.updateOption);
  const updateComponentStyle = useSettingsStore(
    (state) => state.updateComponentStyle,
  );
  const updateNamingConvention = useSettingsStore(
    (state) => state.updateNamingConvention,
  );
  const updateCodeFormatting = useSettingsStore(
    (state) => state.updateCodeFormatting,
  );
  const updateSvgOptimization = useSettingsStore(
    (state) => state.updateSvgOptimization,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <Checkbox
          id="option-currentColor"
          checked={currentColor}
          onCheckedChange={(checked) =>
            updateOption("currentColor", checked === true)
          }
        />
        <div className="grid gap-1">
          <Label htmlFor="option-currentColor">currentColor</Label>
          <p className="text-sm text-muted-foreground">
            Replace black fill/stroke with currentColor
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="code-formatting">Code formatting</Label>
        <p className="text-sm text-muted-foreground">
          Controls JSX and TSX output layout. Applies to the next conversion
          and updates existing results.
        </p>
        <Select
          value={codeFormatting}
          onValueChange={(value) => {
            if (value && isCodeFormatting(value)) {
              updateCodeFormatting(value);
            }
          }}
        >
          <SelectTrigger id="code-formatting" className="w-full">
            <SelectValue>{getCodeFormattingLabel(codeFormatting)}</SelectValue>
          </SelectTrigger>
          <SelectContent className="min-w-[min(92vw,420px)]">
            {CODE_FORMATTING_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="items-start py-2"
              >
                <div className="flex min-w-0 flex-col gap-1.5">
                  <pre className="overflow-x-auto rounded-md bg-muted/50 px-2 py-1.5 font-mono text-[11px] leading-snug whitespace-pre text-foreground">
                    {option.preview}
                  </pre>
                  <span>{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="svg-optimization">SVG optimization</Label>
        <p className="text-sm text-muted-foreground">
          Controls SVGO processing for SVG, JSX, and TSX output. Applies to the
          next conversion and updates existing results.
        </p>
        <Select
          value={svgOptimization}
          onValueChange={(value) => {
            if (value && isSvgOptimization(value)) {
              updateSvgOptimization(value);
            }
          }}
        >
          <SelectTrigger id="svg-optimization" className="w-full">
            <SelectValue>
              {getSvgOptimizationLabel(svgOptimization)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="min-w-[min(92vw,420px)]">
            {SVG_OPTIMIZATION_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="items-start py-2"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span>{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="component-style">Component style</Label>
        <p className="text-sm text-muted-foreground">
          Controls how JSX and TSX components are written. Applies to the next
          conversion and updates existing results.
        </p>
        <Select
          value={componentStyle}
          onValueChange={(value) => {
            if (value && isComponentStyle(value)) {
              updateComponentStyle(value);
            }
          }}
        >
          <SelectTrigger id="component-style" className="w-full">
            <SelectValue>{getComponentStyleLabel(componentStyle)}</SelectValue>
          </SelectTrigger>
          <SelectContent className="min-w-[min(92vw,420px)]">
            {COMPONENT_STYLE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="items-start py-2"
              >
                <div className="flex min-w-0 flex-col gap-1.5">
                  <pre className="overflow-x-auto rounded-md bg-muted/50 px-2 py-1.5 font-mono text-[11px] leading-snug whitespace-pre text-foreground">
                    {option.preview}
                  </pre>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="naming-convention">File naming</Label>
        <p className="text-sm text-muted-foreground">
          Controls exported file names (SVG, JSX, TSX, ZIP). Component name in
          generated code stays PascalCase.
        </p>
        <Select
          value={namingConvention}
          onValueChange={(value) => {
            if (value && isNamingConvention(value)) {
              updateNamingConvention(value);
            }
          }}
        >
          <SelectTrigger id="naming-convention" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NAMING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} — {option.example}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
