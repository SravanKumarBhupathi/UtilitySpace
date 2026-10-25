import Link from "next/link";
import { calculators } from "@/data";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, CalendarDays, Tags, Calculator as CalcIcon, Receipt, GraduationCap } from "lucide-react";

const getIcon = (name: string, className?: string) => {
  const icons: Record<string, React.ReactNode> = {
    Percent: <Percent className={className} />,
    CalendarDays: <CalendarDays className={className} />,
    Tags: <Tags className={className} />,
    Calculator: <CalcIcon className={className} />,
    Receipt: <Receipt className={className} />,
    GraduationCap: <GraduationCap className={className} />,
  };
  return icons[name] || <CalcIcon className={className} />;
};

const categories = Array.from(new Set(calculators.map(c => c.category)));

export default function CalculatorsIndex() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16 bg-background">
      <header className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          All Calculators
        </h1>
        <p className="text-xl text-secondary-text max-w-2xl">
          Quick, accurate calculators for finance, math, education, and everyday life.
        </p>
      </header>

      <div className="space-y-16">
        {categories.map(category => (
          <section key={category}>
            <h2 className="font-heading text-2xl font-bold mb-6 border-b border-border pb-2">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {calculators.filter(c => c.category === category).map(calc => (
                <Link key={calc.id} href={calc.href} className="group block">
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col">
                    <CardContent className="p-6 flex items-start gap-4 h-full">
                       <div className="p-2.5 bg-muted text-secondary-foreground rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                          {getIcon(calc.icon || "", "w-6 h-6")}
                       </div>
                       <div>
                         <h3 className="font-heading font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors leading-tight">
                            {calc.title}
                         </h3>
                         <p className="text-sm text-secondary-text leading-snug">{calc.description}</p>
                       </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
