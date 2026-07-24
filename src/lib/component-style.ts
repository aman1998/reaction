export type ComponentStyle =
  | "defaultExport"
  | "defaultForwardRef"
  | "defaultMemoForwardRef"
  | "namedExport"
  | "namedForwardRef";

export const COMPONENT_STYLES: ComponentStyle[] = [
  "defaultExport",
  "defaultForwardRef",
  "defaultMemoForwardRef",
  "namedExport",
  "namedForwardRef",
];

export const DEFAULT_COMPONENT_STYLE: ComponentStyle = "defaultForwardRef";

export type SvgrStyleOptions = {
  exportType: "default" | "named";
  forwardRef: boolean;
  memo: boolean;
};

export type ComponentStyleOption = {
  value: ComponentStyle;
  label: string;
  preview: string;
};

export const COMPONENT_STYLE_OPTIONS: ComponentStyleOption[] = [
  {
    value: "defaultExport",
    label: "Default export",
    preview: `const IconName = (props) => (
  <svg {...props}>...</svg>
);
export default IconName;`,
  },
  {
    value: "defaultForwardRef",
    label: "Default export + forwardRef",
    preview: `const IconName = forwardRef((props, ref) => (
  <svg ref={ref} {...props}>...</svg>
));
export default IconName;`,
  },
  {
    value: "defaultMemoForwardRef",
    label: "Default export + memo + forwardRef",
    preview: `const IconName = memo(
  forwardRef((props, ref) => (
    <svg ref={ref} {...props}>...</svg>
  )),
);
export default IconName;`,
  },
  {
    value: "namedExport",
    label: "Named export",
    preview: `export const IconName = (props) => (
  <svg {...props}>...</svg>
);`,
  },
  {
    value: "namedForwardRef",
    label: "Named export + forwardRef",
    preview: `export const IconName = forwardRef((props, ref) => (
  <svg ref={ref} {...props}>...</svg>
));`,
  },
];

export function isComponentStyle(value: string): value is ComponentStyle {
  return COMPONENT_STYLES.includes(value as ComponentStyle);
}

export function getComponentStyleLabel(style: ComponentStyle): string {
  return (
    COMPONENT_STYLE_OPTIONS.find((option) => option.value === style)?.label ??
    style
  );
}

export function getSvgrStyleOptions(style: ComponentStyle): SvgrStyleOptions {
  switch (style) {
    case "defaultExport":
      return { exportType: "default", forwardRef: false, memo: false };
    case "defaultForwardRef":
      return { exportType: "default", forwardRef: true, memo: false };
    case "defaultMemoForwardRef":
      return { exportType: "default", forwardRef: true, memo: true };
    case "namedExport":
      return { exportType: "named", forwardRef: false, memo: false };
    case "namedForwardRef":
      return { exportType: "named", forwardRef: true, memo: false };
  }
}

export function migrateLegacyOptions(opts: {
  forwardRef?: boolean;
  memo?: boolean;
}): ComponentStyle {
  if (opts.memo && opts.forwardRef) {
    return "defaultMemoForwardRef";
  }

  if (opts.forwardRef) {
    return "defaultForwardRef";
  }

  if (opts.memo) {
    return "defaultMemoForwardRef";
  }

  return "defaultExport";
}
