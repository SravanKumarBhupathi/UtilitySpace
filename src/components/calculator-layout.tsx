import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, ShieldCheck, Zap, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  howToSteps?: string[];
  faqs?: FAQItem[];
  formulaExplanation?: string;
}

export function CalculatorLayout({
  title,
  description,
  children,
  howToSteps,
  faqs,
  formulaExplanation,
}: CalculatorLayoutProps) {
  const defaultSteps = [
    `Enter the required numerical values into the input fields above.`,
    `Double-check your parameters to ensure all entered data is accurate.`,
    `Click the Calculate button to view instant, real-time results computed securely in your browser.`,
  ];

  const defaultFaqs: FAQItem[] = [
    {
      question: `Is the ${title} completely free to use?`,
      answer: `Yes, 100% free. You can perform as many calculations as you need without any hidden fees, subscriptions, or account creation.`,
    },
    {
      question: `Is my calculation data private and secure?`,
      answer: `All calculations are executed entirely inside your device's web browser using client-side JavaScript. Your personal numbers and entries are never uploaded, stored, or transmitted to any external server.`,
    },
    {
      question: `Can I use this calculator on mobile devices?`,
      answer: `Yes, UtilitySpace is fully responsive and optimized for smartphones, tablets, laptops, and desktop computers.`,
    },
    {
      question: `How accurate are the results?`,
      answer: `Our calculators use industry-standard mathematical algorithms and financial formulas. However, for binding banking, legal, or tax commitments, we always advise verifying figures with certified professionals.`,
    },
  ];

  const activeSteps = howToSteps && howToSteps.length > 0 ? howToSteps : defaultSteps;
  const activeFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${title} — UtilitySpace`,
    "description": description,
    "applicationCategory": "EducationalApplication",
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
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/calculators" className="hover:text-primary transition-colors">
          Calculators
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
          {title}
        </h1>
        <p className="text-lg text-secondary-text leading-relaxed">
          {description}
        </p>
      </header>

      {/* Main Interactive Calculator Area */}
      <main className="mb-14">
        {children}
      </main>

      {/* Editorial Content Section for AdSense and Search Indexing */}
      <section className="space-y-12 border-t border-border pt-12">
        {/* How to use */}
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

        {formulaExplanation && (
          <div className="p-6 bg-muted/40 rounded-xl border border-border">
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              Formula & Calculation Methodology
            </h3>
            <p className="text-secondary-text leading-relaxed text-sm">
              {formulaExplanation}
            </p>
          </div>
        )}

        {/* Value Proposition & Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="p-5 bg-card rounded-xl border border-border">
            <ShieldCheck className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-heading font-semibold text-foreground mb-1 text-base">
              100% Private
            </h4>
            <p className="text-xs text-secondary-text leading-normal">
              Zero server logging. All calculations run strictly in your web browser.
            </p>
          </div>
          <div className="p-5 bg-card rounded-xl border border-border">
            <Zap className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-heading font-semibold text-foreground mb-1 text-base">
              Instant Results
            </h4>
            <p className="text-xs text-secondary-text leading-normal">
              Computed in real time using client-side JavaScript algorithms with no delay.
            </p>
          </div>
          <div className="p-5 bg-card rounded-xl border border-border">
            <HelpCircle className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-heading font-semibold text-foreground mb-1 text-base">
              Always Free
            </h4>
            <p className="text-xs text-secondary-text leading-normal">
              No registration, no email signups, and no paywalls. Built for everyday productivity.
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
