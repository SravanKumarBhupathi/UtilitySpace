import type { Metadata } from "next";
import Link from "next/link";
import { calculators } from "@/data/calculators";
import { getIcon } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Free Online Calculators — Finance, Math, Date & Education",
  description: "Accurate and free online calculators for EMI, Compound Interest, GST, Percentages, Age, and Date Differences. Instant calculations with clear step-by-step logic.",
  alternates: {
    canonical: "https://utilityspace.online/calculators",
  },
};

export default function CalculatorsIndex() {
  const categories = Array.from(new Set(calculators.map((c) => c.category)));

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16 bg-background">
      <header className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Free Online Calculators
        </h1>
        <p className="text-xl text-secondary-text max-w-2xl">
          Quick, reliable calculators for personal finance, mathematical calculations, date duration, and student academics.
        </p>
      </header>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="font-heading text-2xl font-bold mb-6 border-b border-border pb-2">
              {category} Calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {calculators
                .filter((c) => c.category === category)
                .map((calc) => {
                  const isComingSoon = calc.status === "coming-soon";
                  const CardInner = (
                    <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col">
                      <CardContent className="p-6 flex items-start gap-4 h-full">
                        <div className="p-2.5 bg-muted text-secondary-foreground rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                          {getIcon(calc.icon || "", "w-6 h-6")}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
                              {calc.title}
                            </h3>
                            {isComingSoon && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider shrink-0">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-secondary-text leading-snug">
                            {calc.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );

                  return isComingSoon ? (
                    <div key={calc.id} className="group block opacity-75 cursor-default">
                      {CardInner}
                    </div>
                  ) : (
                    <Link key={calc.id} href={calc.href} className="group block">
                      {CardInner}
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
