import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { guides } from "@/data/guides";
import { guideContent } from "@/data/guide-content";

export function generateStaticParams() {
  return guides.map((guide) => {
    // extract just the slug part
    const slug = guide.href.split('/').pop();
    return { slug };
  });
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = params.slug;
  const guide = guides.find((g) => g.href.endsWith(`/${slug}`));

  if (!guide) {
    return { title: 'Guide Not Found' };
  }

  return {
    title: guide.title,
    description: guide.description,
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const guide = guides.find((g) => g.href.endsWith(`/${slug}`));
  const content = guideContent[slug];

  if (!guide || !content) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/guides" className="hover:text-primary transition-colors">
          Guides
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium truncate">{guide.title}</span>
      </nav>

      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
            {guide.category}
          </span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
          {guide.title}
        </h1>
        <p className="text-lg md:text-xl text-secondary-text leading-relaxed">
          {guide.description}
        </p>
      </header>

      <article className="prose prose-slate dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-a:text-primary max-w-none text-foreground/90">
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </article>

      {content.relatedTool && (
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="font-heading text-xl font-bold mb-4">Ready to try it?</h3>
          <Link href={content.relatedTool.href} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            {content.relatedTool.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
