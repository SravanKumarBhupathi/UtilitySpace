import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Zap, Lock, CheckCircle2 } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  category?: string;
  howToSteps?: string[];
  faqs?: FAQItem[];
  aboutText?: string;
}

export function ToolLayout({
  title,
  description,
  children,
  category = "Tools",
  howToSteps,
  faqs,
  aboutText,
}: ToolLayoutProps) {
  const defaultSteps = [
    `Upload your input file or paste your text into the tool interface above.`,
    `Adjust your preferences, options, or conversion parameters as needed.`,
    `Download your processed file or copy the modified result directly to your clipboard.`,
  ];

  const defaultFaqs: FAQItem[] = [
    {
      question: `Are my files or text uploaded to your servers?`,
      answer: `No. All file conversions, text formatting, and image edits occur 100% locally on your computer or phone using modern browser APIs (HTML5 Canvas, WebAssembly, and JavaScript). Your sensitive documents never leave your device.`,
    },
    {
      question: `Is this tool free with no limits?`,
      answer: `Yes, UtilitySpace tools are completely free to use with no hidden subscription fees, credits, or registration requirements.`,
    },
    {
      question: `Does it work on mobile phones and tablets?`,
      answer: `Yes, all our tools are fully responsive and work seamlessly across Android, iOS, Windows, macOS, and Linux web browsers.`,
    },
    {
      question: `Do I need to install any software or browser extensions?`,
      answer: `No external plugins or downloads are needed. Everything runs directly inside your standard web browser.`,
    },
  ];

  const activeSteps = howToSteps && howToSteps.length > 0 ? howToSteps : defaultSteps;
  const activeFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${title} — UtilitySpace`,
    "description": description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/tools" className="hover:text-primary transition-colors">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/tools/${category.toLowerCase()}`}
          className="hover:text-primary transition-colors"
        >
          {category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      <header className="mb-10 text-center">
        <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
          {title}
        </h1>
        <p className="text-lg text-secondary-text max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </header>

      {/* Main Interactive Tool Widget */}
      <main className="mb-14">
        {children}
      </main>

      {/* Comprehensive Editorial & FAQ Section for SEO Indexation & AdSense */}
      <section className="space-y-12 border-t border-border pt-12">
        {/* About this tool */}
        {aboutText && (
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              About {title}
            </h2>
            <p className="text-secondary-text leading-relaxed">
              {aboutText}
            </p>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" /> How to Use the {title}
          </h2>
          <ol className="space-y-3 text-secondary-text list-decimal pl-6 leading-relaxed">
            {activeSteps.map((step, idx) => (
              <li key={idx} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Client-Side Privacy Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
          <div className="p-5 bg-card rounded-xl border border-border">
            <Lock className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-heading font-semibold text-foreground mb-1 text-base">
              Local Browser Execution
            </h4>
            <p className="text-xs text-secondary-text leading-normal">
              Your files and data remain strictly on your device. Never uploaded to remote servers.
            </p>
          </div>
          <div className="p-5 bg-card rounded-xl border border-border">
            <Zap className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-heading font-semibold text-foreground mb-1 text-base">
              Lightning Fast
            </h4>
            <p className="text-xs text-secondary-text leading-normal">
              No server network round-trips or wait queues. Instant processing via client CPU.
            </p>
          </div>
          <div className="p-5 bg-card rounded-xl border border-border">
            <ShieldCheck className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-heading font-semibold text-foreground mb-1 text-base">
              100% Free & Unlimited
            </h4>
            <p className="text-xs text-secondary-text leading-normal">
              No daily conversion caps, file size fees, or accounts required.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {activeFaqs.map((faq, idx) => (
              <div key={idx} className="p-5 bg-card rounded-xl border border-border">
                <h3 className="font-heading font-semibold text-foreground text-base mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-secondary-text leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
