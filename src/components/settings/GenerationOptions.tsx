"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useSettingsStore,
  type GenerationOptions as GenerationOptionsType,
} from "@/stores/settings-store";

const OPTION_ITEMS: {
  key: keyof GenerationOptionsType;
  label: string;
  description: string;
}[] = [
  {
    key: "currentColor",
    label: "currentColor",
    description: "Заменять чёрный fill/stroke на currentColor",
  },
  {
    key: "forwardRef",
    label: "forwardRef",
    description: "Оборачивать компонент в React.forwardRef",
  },
  {
    key: "memo",
    label: "React.memo",
    description: "Оборачивать компонент в React.memo",
  },
];

export function GenerationOptions() {
  const currentColor = useSettingsStore((state) => state.currentColor);
  const forwardRef = useSettingsStore((state) => state.forwardRef);
  const memo = useSettingsStore((state) => state.memo);
  const updateOption = useSettingsStore((state) => state.updateOption);

  const options: Required<GenerationOptionsType> = {
    currentColor,
    forwardRef,
    memo,
  };

  return (
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
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
