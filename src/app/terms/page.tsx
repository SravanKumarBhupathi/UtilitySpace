import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | UtilitySpace",
  description: "Read the Terms of Use for UtilitySpace. Learn about usage guidelines for our free online tools, calculators, and guides.",
  alternates: {
    canonical: "https://utilityspace.online/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
          Terms of Use
        </h1>
        <p className="text-sm text-secondary-text">Last Updated: October 2026</p>
      </header>

      <main className="prose prose-slate dark:prose-invert max-w-none text-secondary-text space-y-6 text-base leading-relaxed">
        <p>
          Welcome to <strong>UtilitySpace</strong>. By accessing or using our website, tools, calculators, and informational content, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please discontinue using the site.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">1. Use of Tools & Content</h2>
        <p>
          UtilitySpace provides free online tools for image processing, PDF manipulation, text formatting, mathematical calculations, and developmental assistance. These utilities are provided free of charge for personal and legitimate professional purposes.
        </p>
        <p>
          You agree not to misuse our services, introduce malicious code, execute denial-of-service attempts, or scrape/automate calls to our infrastructure in a way that disrupts service for other users.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">2. Intellectual Property</h2>
        <p>
          The layout, design, trademarks, source code, logos, and original guides on UtilitySpace are the intellectual property of UtilitySpace and its creators, protected by applicable copyright and trademark laws.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">3. Disclaimers & Accuracy of Calculations</h2>
        <p>
          Our calculators, converters, and analytical tools are provided for general educational, estimation, and informational purposes. While we rigorously test our mathematical and algorithmic implementations, UtilitySpace makes no express or implied warranty regarding 100% precision for critical legal, banking, medical, or academic certification purposes. Always cross-verify critical numbers with certified professionals.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, UtilitySpace and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our tools or reliance on any calculations.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">5. Modifications to Services</h2>
        <p>
          We reserve the right to modify, enhance, update, or discontinue any tool, calculator, or feature at any time without notice.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">6. Governing Law</h2>
        <p>
          These Terms shall be interpreted and governed in accordance with applicable laws, without regard to its conflict of law provisions.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">7. Contact Information</h2>
        <p>
          For questions regarding our Terms of Use, please reach out via email at{" "}
          <a href="mailto:contact@utilityspace.online" className="text-primary hover:underline">
            contact@utilityspace.online
          </a>.
        </p>
      </main>
    </div>
  );
}
