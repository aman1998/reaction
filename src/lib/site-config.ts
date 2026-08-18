export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://imagetodev.com";

export const SITE_NAME = "Image to Dev";

export const SITE_DESCRIPTION =
  "Convert PNG, JPG, WebP, and SVG images into optimized SVG and React JSX/TSX components. 100% in-browser — files never leave your device. Batch processing, ZIP export, and configurable component styles.";

export const DEFAULT_KEYWORDS = [
  "png to react",
  "svg to tsx",
  "image to react component",
  "jpg to jsx",
  "webp to react",
  "svg to react component",
  "convert image to react",
  "react icon converter",
  "svg optimizer",
  "image vectorization",
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const HOME_FAQ: FaqItem[] = [
  {
    question: "Is Image to Dev free to use?",
    answer:
      "Yes. Image to Dev is free. All processing runs locally in your browser with no account required.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. Vectorization, SVG optimization, and JSX/TSX generation happen entirely in your browser. Your files never leave your device.",
  },
  {
    question: "Which image formats are supported?",
    answer:
      "PNG, JPG, JPEG, WebP, and SVG files up to 5 MB each. You can convert multiple files in one batch.",
  },
  {
    question: "What output formats do I get?",
    answer:
      "Optimized SVG plus ready-to-use React JSX and TypeScript TSX components. Download individually or as a ZIP archive.",
  },
];

export const PUBLIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/png-to-react", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/jpg-to-react", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/webp-to-react", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/svg-to-react", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/image-to-tsx", priority: 0.9, changeFrequency: "weekly" as const },
  {
    path: "/png-to-react-component-no-upload",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/batch-icons-to-react-components",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/logo-to-react-component",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/svg-to-react-component-online",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/free-react-icon-converter",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  { path: "/style", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
];
