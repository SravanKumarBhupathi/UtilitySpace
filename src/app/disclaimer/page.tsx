import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | UtilitySpace",
  description: "Read the official Disclaimer for UtilitySpace online tools, educational content, and financial calculators.",
  alternates: {
    canonical: "https://utilityspace.online/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
          Disclaimer
        </h1>
        <p className="text-sm text-secondary-text">Last Updated: October 2026</p>
      </header>

      <main className="prose prose-slate dark:prose-invert max-w-none text-secondary-text space-y-6 text-base leading-relaxed">
        <p>
          The information, calculators, guides, and digital tools provided on <strong>UtilitySpace</strong> (https://utilityspace.online) are intended solely for general informational, educational, and computational assistance.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">No Professional Financial or Legal Advice</h2>
        <p>
          Our financial calculators (including EMI, Compound Interest, Simple Interest, and GST Calculators) generate mathematical projections based on formulas and standard amortization algorithms. <strong>They do not constitute certified financial planning, tax accounting, mortgage advice, or legal counsel.</strong>
        </p>
        <p>
          Financial policies, interest calculation conventions (such as reducing balance vs. flat rate), bank processing fees, and tax regulations vary across jurisdictions. Always consult a qualified accountant, registered investment advisor, or banking representative prior to signing loan agreements or making financial investments.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">Educational & Accuracy Estimates</h2>
        <p>
          Tools such as the GPA Calculator, Attendance Calculator, and Exam Percentage Calculator are designed to help students track educational metrics. Official grading systems (relative grading, GPA curves, credit weighting) differ per institution; always refer to your university or school handbook for binding transcript calculations.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">Data Handling & File Security</h2>
        <p>
          UtilitySpace processes file modifications (such as PDF merging/splitting, image resizing/compression, and text sorting) on your local device client-side. We do not store or inspect your private files. Users are advised to retain backup copies of original files before performing any transformation or compression.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">Contact</h2>
        <p>
          If you have any questions about this disclaimer, contact us at{" "}
          <a href="mailto:contact@utilityspace.online" className="text-primary hover:underline">
            contact@utilityspace.online
          </a>.
        </p>
      </main>
    </div>
  );
}
