export type CodeFormatting = "compact" | "formatted";

export const CODE_FORMATTINGS: CodeFormatting[] = ["compact", "formatted"];

export const DEFAULT_CODE_FORMATTING: CodeFormatting = "compact";

export type CodeFormattingOption = {
  value: CodeFormatting;
  label: string;
  description: string;
  preview: string;
};

export const CODE_FORMATTING_OPTIONS: CodeFormattingOption[] = [
  {
    value: "compact",
    label: "Compact",
    description: "Minified single-line output",
    preview: `const Icon = (props) => <svg {...props}><path d="..." /></svg>;`,
  },
  {
    value: "formatted",
    label: "Formatted",
    description: "Multi-line readable code",
    preview: `const Icon = (props) => (
  <svg {...props}>
    <path d="..." />
  </svg>
);`,
  },
];

export function isCodeFormatting(value: string): value is CodeFormatting {
  return CODE_FORMATTINGS.includes(value as CodeFormatting);
}

export function getCodeFormattingLabel(formatting: CodeFormatting): string {
  return (
    CODE_FORMATTING_OPTIONS.find((option) => option.value === formatting)
      ?.label ?? formatting
  );
}

export function isFormattedCode(formatting: CodeFormatting | undefined): boolean {
  return formatting === "formatted";
}
