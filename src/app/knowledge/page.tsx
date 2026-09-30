import Link from "next/link";
import { knowledge } from "@/data";
import { Card, CardContent } from "@/components/ui/card";

export default function KnowledgeIndex() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Knowledge Base
        </h1>
        <p className="text-xl text-secondary-text max-w-2xl">
          Evergreen information to help you understand basic technology concepts.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {knowledge.map(item => (
          <Link key={item.id} href={item.href} className="group block">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full bg-card">
              <CardContent className="p-6">
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-3">{item.category}</p>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                   {item.title}
                </h3>
                <p className="text-sm text-secondary-text">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
