import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { knowledge } from "@/data/knowledge";
import { knowledgeContent } from "@/data/knowledge-content";
import { Card, CardContent } from "@/components/ui/card";

export function generateStaticParams() {
  return knowledge.map((item) => {
    const slug = item.href.split('/').pop();
    return { slug };
  });
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = params.slug;
  const item = knowledge.find((g) => g.href.endsWith(`/${slug}`));

  if (!item) {
    return { title: 'Knowledge Not Found' };
  }

  return {
    title: item.title,
    description: item.description,
  };
}

export default function KnowledgeDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const item = knowledge.find((g) => g.href.endsWith(`/${slug}`));
  const content = knowledgeContent[slug];

  if (!item || !content) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/knowledge" className="hover:text-primary transition-colors">
          Knowledge
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium truncate">{item.title}</span>
      </nav>

      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
          {item.title}
        </h1>
        <p className="text-lg md:text-xl text-secondary-text leading-relaxed">
          {item.description}
        </p>
      </header>

      <article className="prose prose-slate dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-a:text-primary max-w-none text-foreground/90">
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </article>

      {/* Internal Links / Related Topics */}
      {content.relatedTopics && content.relatedTopics.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary-text" /> Related Topics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.relatedTopics.map((topic, idx) => (
              <Link key={idx} href={topic.href} className="group block">
                <Card className="hover:border-primary/50 hover:shadow-sm transition-all bg-muted/20">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{topic.title}</span>
                    <ArrowRight className="w-4 h-4 text-secondary-text group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tool Link */}
      {content.relatedTool && (
        <div className="mt-8 pt-8 border-t border-border">
           <h3 className="font-heading text-xl font-bold mb-4">Ready to try it?</h3>
           <Link href={content.relatedTool.href} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
             {content.relatedTool.label} <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      )}
    </div>
  );
}
