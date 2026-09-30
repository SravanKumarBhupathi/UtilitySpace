import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CalculatorLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/calculators" className="hover:text-primary transition-colors">
          Calculators
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>
      <header className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          {title}
        </h1>
        <p className="text-lg text-secondary-text">
          {description}
        </p>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
