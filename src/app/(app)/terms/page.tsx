const TERMS_SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using Image to Dev (&quot;the Service&quot;), you agree
        to these Terms of Service. If you do not agree, do not use the Service.
      </p>
    ),
  },
  {
    title: "Description of the Service",
    content: (
      <p>
        Image to Dev is a web tool that converts image files (PNG, JPG, JPEG,
        WebP, and SVG) into optimized SVG and React component code (JSX and
        TSX). The Service includes batch processing, preview, code export, ZIP
        downloads, and configurable generation options.
      </p>
    ),
  },
  {
    title: "Your Content",
    content: (
      <p>
        You are solely responsible for the files you upload. You represent that
        you have the necessary rights, licenses, or permissions to use and
        convert those files. You must not upload content that is illegal,
        infringing, harmful, or violates third-party rights.
      </p>
    ),
  },
  {
    title: "Processing and Data",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Raster vectorization and SVG optimization run locally in your browser.</li>
        <li>
          To generate JSX/TSX, optimized SVG content is sent to our server for
          processing.
        </li>
        <li>
          Conversion results and settings may be stored locally in your browser
          (IndexedDB and localStorage) to restore your session.
        </li>
        <li>
          We do not operate user accounts. You can remove stored data at any time
          using the Clear function or by clearing your browser data.
        </li>
      </ul>
    ),
  },
  {
    title: "Acceptable Use",
    content: (
      <p>
        You agree not to misuse the Service, including: uploading malicious
        files, attempting to disrupt or overload the Service, circumventing
        technical limits, or using the Service for unlawful purposes.
      </p>
    ),
  },
  {
    title: "Technical Limits",
    content: (
      <p>
        The Service applies limits including: maximum upload size of 5 MB per
        file, maximum SVG size of 500 KB for code generation, and maximum
        raster dimension of 1024px for vectorization. We may change these limits
        without notice.
      </p>
    ),
  },
  {
    title: "Output and Accuracy",
    content: (
      <p>
        Generated SVG and React code is provided on an automated basis. We do
        not guarantee accuracy, completeness, or suitability for production.
        You are responsible for reviewing and testing all output before use.
      </p>
    ),
  },
  {
    title: "Intellectual Property",
    content: (
      <p>
        You retain ownership of your uploaded files and generated output. You
        grant us a limited license to process your uploaded content solely to
        provide the Service. The Service software, branding, and interface
        remain our property.
      </p>
    ),
  },
  {
    title: "Disclaimer",
    content: (
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
        WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
        ANY LOSS OF DATA, PROFITS, OR GOODWILL, ARISING FROM YOUR USE OF THE
        SERVICE.
      </p>
    ),
  },
  {
    title: "Changes to Terms",
    content: (
      <p>
        We may update these Terms at any time. Continued use after changes
        constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    title: "Contact",
    content: (
      <p>
        For questions about these Terms, contact us through the project&apos;s
        official support or repository channels.
      </p>
    ),
  },
] as const;

export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: July 2026
        </p>
      </header>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
        {TERMS_SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-foreground">
              {section.title}
            </h2>
            {section.content}
          </section>
        ))}
      </div>
    </div>
  );
}
