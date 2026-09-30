import Link from "next/link";
import { guides } from "@/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function GuidesIndex() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Practical Guides
        </h1>
        <p className="text-xl text-secondary-text max-w-2xl">
          Simple explanations and step-by-step instructions for everyday digital tasks.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map(guide => (
          <Link key={guide.id} href={guide.href} className="group block">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{guide.category}</p>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                     {guide.title}
                  </h3>
                  <p className="text-sm text-secondary-text">{guide.description}</p>
                </div>
                <div className="mt-6 flex items-center text-sm font-medium text-secondary-text group-hover:text-primary transition-colors">
                  Read guide <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
