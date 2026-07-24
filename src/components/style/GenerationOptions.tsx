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
  isNamingConvention,
  type NamingConvention,
} from "@/lib/image-utils";
import {
  useSettingsStore,
  type GenerationOptions as GenerationOptionsType,
} from "@/stores/settings-store";

const OPTION_ITEMS: {
  key: keyof Pick<GenerationOptionsType, "currentColor" | "forwardRef" | "memo">;
  label: string;
  description: string;
}[] = [
  {
    key: "currentColor",
    label: "currentColor",
    description: "Replace black fill/stroke with currentColor",
  },
  {
    key: "forwardRef",
    label: "forwardRef",
    description: "Wrap the component with React.forwardRef",
  },
  {
    key: "memo",
    label: "React.memo",
    description: "Wrap the component with React.memo",
  },
];

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
  const forwardRef = useSettingsStore((state) => state.forwardRef);
  const memo = useSettingsStore((state) => state.memo);
  const namingConvention = useSettingsStore((state) => state.namingConvention);
  const updateOption = useSettingsStore((state) => state.updateOption);
  const updateNamingConvention = useSettingsStore(
    (state) => state.updateNamingConvention,
  );

  const options: Required<
    Pick<GenerationOptionsType, "currentColor" | "forwardRef" | "memo">
  > = {
    currentColor,
    forwardRef,
    memo,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {OPTION_ITEMS.map((item) => (
          <div key={item.key} className="flex items-start gap-3">
            <Checkbox
              id={`option-${item.key}`}
              checked={options[item.key]}
              onCheckedChange={(checked) =>
                updateOption(item.key, checked === true)
              }
            />
            <div className="grid gap-1">
              <Label htmlFor={`option-${item.key}`}>{item.label}</Label>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
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
