import type { FaqItem } from "@/lib/site-config";

export type LandingPageConfig = {
  slug: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  benefits: string[];
  faq: FaqItem[];
};

const LANDING_PAGES: LandingPageConfig[] = [
  {
    slug: "png-to-react",
    path: "/png-to-react",
    title: "PNG to React Component Converter",
    description:
      "Convert PNG icons and images to optimized SVG and React JSX/TSX components in your browser. Free, private, and batch-ready.",
    keywords: [
      "png to react",
      "png to react component",
      "png to jsx",
      "png to tsx",
      "convert png to react",
    ],
    h1: "Convert PNG to React Components",
    intro:
      "Upload a PNG file and get an optimized SVG plus copy-paste React JSX and TypeScript TSX code. Ideal for icons, logos, and UI assets.",
    benefits: [
      "Automatic vectorization for raster PNG files",
      "SVGO optimization for smaller SVG output",
      "JSX and TSX with configurable component styles",
      "Batch convert multiple PNG files and download a ZIP",
    ],
    faq: [
      {
        question: "Can I convert a PNG to a React component?",
        answer:
          "Yes. Upload your PNG and Image to Dev vectorizes it, optimizes the SVG, and generates React JSX and TSX components you can drop into your project.",
      },
      {
        question: "Does PNG conversion happen on a server?",
        answer:
          "No. PNG vectorization and code generation run locally in your browser. Your files are never uploaded.",
      },
      {
        question: "What is the maximum PNG file size?",
        answer:
          "Each PNG file can be up to 5 MB. You can process multiple files in one batch.",
      },
    ],
  },
  {
    slug: "jpg-to-react",
    path: "/jpg-to-react",
    title: "JPG to React Component Converter",
    description:
      "Convert JPG and JPEG images to optimized SVG and React JSX/TSX components. 100% in-browser — fast, free, and private.",
    keywords: [
      "jpg to react",
      "jpeg to react component",
      "jpg to jsx",
      "jpg to tsx",
      "convert jpeg to react",
      "convert jpg to react",
    ],
    h1: "Convert JPG to React Components",
    intro:
      "Turn JPG and JPEG photos or icons into clean SVG and ready-to-use React components without leaving your browser.",
    benefits: [
      "Works with JPG and JPEG uploads",
      "Browser-based vectorization — no server upload",
      "Export SVG, JSX, TSX, or all formats in a ZIP",
      "Configurable naming conventions and component styles",
    ],
    faq: [
      {
        question: "Can JPEG files be converted to React components?",
        answer:
          "Yes. Image to Dev supports JPG and JPEG files, vectorizes them when needed, and outputs optimized SVG plus JSX/TSX code.",
      },
      {
        question: "Will photo quality affect the SVG result?",
        answer:
          "Complex photos may produce detailed SVG paths. The tool works best for icons, logos, and simple graphics.",
      },
      {
        question: "Is JPG to React conversion free?",
        answer: "Yes. Image to Dev is free and requires no account.",
      },
    ],
  },
  {
    slug: "webp-to-react",
    path: "/webp-to-react",
    title: "WebP to React Component Converter",
    description:
      "Convert WebP images to optimized SVG and React JSX/TSX components online. Private in-browser processing with batch support.",
    keywords: [
      "webp to react",
      "webp to react component",
      "webp to jsx",
      "webp to tsx",
      "convert webp to react",
    ],
    h1: "Convert WebP to React Components",
    intro:
      "Upload WebP assets and instantly get optimized SVG plus React JSX and TSX components for your frontend projects.",
    benefits: [
      "Native WebP support up to 5 MB per file",
      "No install — works entirely in the browser",
      "Preview original and SVG side by side",
      "Batch processing with ZIP download",
    ],
    faq: [
      {
        question: "Does Image to Dev support WebP files?",
        answer:
          "Yes. WebP is fully supported alongside PNG, JPG, JPEG, and SVG.",
      },
      {
        question: "Can I convert multiple WebP files at once?",
        answer:
          "Yes. Upload several WebP files in one batch, then download all results as a ZIP.",
      },
      {
        question: "Are WebP files sent to a cloud service?",
        answer:
          "No. All WebP processing happens locally in your browser for maximum privacy.",
      },
    ],
  },
  {
    slug: "svg-to-react",
    path: "/svg-to-react",
    title: "SVG to React Component Converter",
    description:
      "Convert SVG files to React JSX and TSX components with SVGO optimization. Free, in-browser, and ready for production.",
    keywords: [
      "svg to react",
      "svg to react component",
      "svg to jsx",
      "svg to tsx",
      "convert svg to react",
    ],
    h1: "Convert SVG to React Components",
    intro:
      "Paste or upload an SVG and get a clean, optimized React component with JSX and TypeScript TSX output.",
    benefits: [
      "SVGO optimization reduces SVG size",
      "Multiple component style presets",
      "currentColor support for theme-friendly icons",
      "Instant preview and one-click copy",
    ],
    faq: [
      {
        question: "Can I convert an existing SVG to a React component?",
        answer:
          "Yes. Upload an SVG file and Image to Dev optimizes it and generates JSX and TSX React components.",
      },
      {
        question: "Does the tool optimize SVG before generating React code?",
        answer:
          "Yes. SVGO runs automatically to produce smaller, cleaner SVG output before JSX/TSX generation.",
      },
      {
        question: "Can I use currentColor in the generated component?",
        answer:
          "Yes. Enable the currentColor option in Style settings to replace black fill/stroke with currentColor.",
      },
    ],
  },
  {
    slug: "image-to-tsx",
    path: "/image-to-tsx",
    title: "Image to TSX — React TypeScript Component Generator",
    description:
      "Convert any supported image to TypeScript TSX React components. PNG, JPG, WebP, and SVG — optimized SVG plus typed TSX output.",
    keywords: [
      "image to tsx",
      "png to tsx",
      "svg to tsx",
      "react typescript component generator",
      "convert image to tsx",
    ],
    h1: "Convert Images to TSX React Components",
    intro:
      "Generate typed TypeScript TSX components from PNG, JPG, WebP, or SVG files — with optimized SVG and optional JSX output.",
    benefits: [
      "TypeScript TSX with SVGProps typing",
      "Supports PNG, JPG, JPEG, WebP, and SVG",
      "Configurable export naming conventions",
      "100% client-side — files stay on your device",
    ],
    faq: [
      {
        question: "What is the difference between JSX and TSX output?",
        answer:
          "TSX includes TypeScript types such as SVGProps<SVGSVGElement> for better type safety in React projects.",
      },
      {
        question: "Which image formats can be converted to TSX?",
        answer:
          "PNG, JPG, JPEG, WebP, and SVG are all supported for TSX generation.",
      },
      {
        question: "Can I download TSX files in bulk?",
        answer:
          "Yes. After batch conversion, download all TSX files together in a ZIP archive.",
      },
    ],
  },
];

export const LANDING_PAGE_LINKS = LANDING_PAGES.map(({ path, slug }) => ({
  path,
  label: slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
}));

export function getLandingPage(slug: string): LandingPageConfig {
  const page = LANDING_PAGES.find((entry) => entry.slug === slug);

  if (!page) {
    throw new Error(`Unknown landing page slug: ${slug}`);
  }

  return page;
}

export function getAllLandingPages(): LandingPageConfig[] {
  return LANDING_PAGES;
}
