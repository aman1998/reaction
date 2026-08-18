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
  {
    slug: "png-to-react-component-no-upload",
    path: "/png-to-react-component-no-upload",
    title: "PNG to React Component — No Upload, 100% In Browser",
    description:
      "Convert PNG icons and logos to React JSX/TSX locally. Files never leave your device — free batch processing with optimized SVG output.",
    keywords: [
      "png to react component no upload",
      "png to react offline",
      "convert png to react browser",
      "private png to jsx converter",
    ],
    h1: "Convert PNG to React Components Without Uploading",
    intro:
      "Drop a PNG and get optimized SVG plus copy-paste JSX and TSX — entirely in your browser. No account, no server, no subscription.",
    benefits: [
      "All processing runs locally — files stay on your machine",
      "Outputs JSX, TSX, and optimized SVG in one step",
      "Batch convert multiple PNGs and download a ZIP",
      "currentColor and component style presets for production use",
    ],
    faq: [
      {
        question: "Are my PNG files uploaded to a server?",
        answer:
          "No. Vectorization and React code generation happen in your browser.",
      },
      {
        question: "Can I convert multiple PNG icons at once?",
        answer:
          "Yes. Upload a batch and download all JSX/TSX files as a ZIP.",
      },
      {
        question: "Is this free?",
        answer: "Yes. Image to Dev is free with no credits or subscription.",
      },
    ],
  },
  {
    slug: "batch-icons-to-react-components",
    path: "/batch-icons-to-react-components",
    title: "Batch Convert Icons to React Components",
    description:
      "Upload multiple PNG, SVG, or WebP icons and generate React JSX/TSX components in one batch. Download everything as a ZIP.",
    keywords: [
      "batch icons to react",
      "bulk svg to react component",
      "convert icon set to react",
      "batch png to tsx",
    ],
    h1: "Batch Convert Icons to React Components",
    intro:
      "Building a design system or icon library? Convert an entire icon set to typed React components — SVG, JSX, and TSX — in one run.",
    benefits: [
      "Process multiple files in a single queue",
      "Consistent naming conventions (PascalCase, kebab-case, etc.)",
      "SVGO optimization for smaller bundle size",
      "ZIP export with SVG + JSX + TSX for every icon",
    ],
    faq: [
      {
        question: "How many icons can I convert at once?",
        answer:
          "There is no hard limit on batch size. Each file can be up to 5 MB.",
      },
      {
        question: "Do all icons get the same component style?",
        answer:
          "Yes. Set export style, currentColor, and naming once in Style settings.",
      },
      {
        question: "What formats work for batch conversion?",
        answer: "PNG, JPG, JPEG, WebP, and SVG.",
      },
    ],
  },
  {
    slug: "logo-to-react-component",
    path: "/logo-to-react-component",
    title: "Logo to React Component Converter",
    description:
      "Turn a PNG or JPG logo into a scalable React component with optimized SVG, JSX, and TSX output. Free and in-browser.",
    keywords: [
      "logo to react component",
      "convert logo to jsx",
      "png logo to react",
      "logo to svg react",
    ],
    h1: "Convert Your Logo to a React Component",
    intro:
      "Have a raster logo stuck in PNG or JPG? Vectorize it and get a ready-to-use React component for your Next.js or Vite app.",
    benefits: [
      "Works with PNG, JPG, and WebP logos",
      "Side-by-side preview of original and vectorized SVG",
      "forwardRef and memo export styles supported",
      "No Illustrator or manual SVG editing required",
    ],
    faq: [
      {
        question: "Will complex logos vectorize well?",
        answer:
          "Simple logos and wordmarks work best. Very detailed photos may produce large SVG paths.",
      },
      {
        question: "Can I use currentColor for theme switching?",
        answer:
          "Yes. Enable currentColor in Style settings to inherit text color from CSS.",
      },
      {
        question: "Do I get TypeScript types?",
        answer: "Yes. TSX output includes SVGProps<SVGSVGElement> typing.",
      },
    ],
  },
  {
    slug: "svg-to-react-component-online",
    path: "/svg-to-react-component-online",
    title: "SVG to React Component Online — Free SVGR-Style Converter",
    description:
      "Upload an SVG and get optimized React JSX/TSX with forwardRef, memo, and currentColor options. Runs in your browser.",
    keywords: [
      "svg to react component online",
      "svg to jsx converter free",
      "svgr online alternative",
      "svg to tsx generator",
    ],
    h1: "SVG to React Component — Online & Free",
    intro:
      "Skip the CLI setup. Upload an SVG, pick your export style, and copy production-ready React code — optimized with SVGO first.",
    benefits: [
      "SVGO optimization before code generation",
      "5 component export styles (default, forwardRef, memo, named)",
      "Instant preview and one-click copy",
      "No Node.js or build step required",
    ],
    faq: [
      {
        question: "Is this a replacement for SVGR CLI?",
        answer:
          "For quick one-off conversions and previews, yes. For CI pipelines, SVGR CLI may still fit better.",
      },
      {
        question: "Does it optimize the SVG before generating React code?",
        answer:
          "Yes. Choose from balanced, minimal, or conservative SVGO presets.",
      },
      {
        question: "Can I paste SVG code instead of uploading?",
        answer: "Upload an .svg file — paste support may be added later.",
      },
    ],
  },
  {
    slug: "free-react-icon-converter",
    path: "/free-react-icon-converter",
    title: "Free React Icon Converter — PNG, SVG, WebP to JSX/TSX",
    description:
      "Free tool to convert icons into React components. No subscription, no credits, no upload — 100% in-browser.",
    keywords: [
      "free react icon converter",
      "icon to react component free",
      "convert icon to jsx free",
      "react icon generator",
    ],
    h1: "Free React Icon Converter",
    intro:
      "Convert icons from PNG, SVG, or WebP into typed React components — completely free, no account needed.",
    benefits: [
      "Free forever — no per-conversion fees",
      "Private: files never leave your browser",
      "Batch-ready for icon sets and design systems",
      "JSX and TSX with configurable naming",
    ],
    faq: [
      {
        question: "Is there a conversion limit?",
        answer: "No credits or daily limits. Convert as many icons as you need.",
      },
      {
        question: "What icon formats are supported?",
        answer: "PNG, JPG, JPEG, WebP, and SVG up to 5 MB each.",
      },
      {
        question: "Can I use the output in commercial projects?",
        answer: "Yes. You own the generated code. See Terms for details.",
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
