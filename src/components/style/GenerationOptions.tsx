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
  COMPONENT_STYLE_OPTIONS,
  getComponentStyleLabel,
  isComponentStyle,
} from "@/lib/component-style";
import {
  isNamingConvention,
  type NamingConvention,
} from "@/lib/image-utils";
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
  const updateOption = useSettingsStore((state) => state.updateOption);
  const updateComponentStyle = useSettingsStore(
    (state) => state.updateComponentStyle,
  );
  const updateNamingConvention = useSettingsStore(
    (state) => state.updateNamingConvention,
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
