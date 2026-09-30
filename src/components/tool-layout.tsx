import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ToolLayout({
  title,
  description,
  children,
  category = "Tools"
}: {
  title: string;
  description: string;
  children: ReactNode;
  category?: string;
}) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/tools" className="hover:text-primary transition-colors">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/tools/${category.toLowerCase()}`} className="hover:text-primary transition-colors">
          {category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>
      <header className="mb-10 text-center">
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          {title}
        </h1>
        <p className="text-lg text-secondary-text max-w-2xl mx-auto">
          {description}
        </p>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
