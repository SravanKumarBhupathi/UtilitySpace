import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight, Clock, CalendarDays } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { blogPosts } from "@/data/blog";
import { blogContent } from "@/data/blog-content";
import { Card, CardContent } from "@/components/ui/card";

export function generateStaticParams() {
  return blogPosts.map((post) => {
    const slug = post.href.split('/').pop();
    return { slug };
  });
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = params.slug;
  const post = blogPosts.find((p) => p.href.endsWith(`/${slug}`));

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["UtilitySpace"],
    }
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const post = blogPosts.find((p) => p.href.endsWith(`/${slug}`));
  const content = blogContent[slug];

  if (!post || !content) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Organization",
      "name": "UtilitySpace",
      "url": "https://utilityspace.online"
    },
    "datePublished": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://utilityspace.online${post.href}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-foreground font-medium truncate">{post.title}</span>
        </nav>

        <header className="mb-10 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-secondary-text">
            <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> {post.date}</span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readingTime}</span>
          </div>
        </header>

        <div className="mb-12 relative aspect-[16/9] w-full bg-muted rounded-2xl overflow-hidden border border-border flex items-center justify-center">
          <SafeImage
            src={content.heroImage}
            alt={content.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="prose prose-slate dark:prose-invert prose-lg prose-headings:font-heading prose-headings:font-bold prose-a:text-primary max-w-3xl mx-auto text-foreground/90">
          <div dangerouslySetInnerHTML={{ __html: content.html }} />
        </article>

        {content.relatedIds && content.relatedIds.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border max-w-4xl mx-auto">
            <h3 className="font-heading text-2xl font-bold mb-6">Read next</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.relatedIds.map((id) => {
                const relatedPost = blogPosts.find(p => p.id === id);
                if (!relatedPost) return null;
                return (
                  <Link key={relatedPost.id} href={relatedPost.href} className="group block h-full">
                    <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full bg-card">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3 text-xs text-secondary-text">
                          <span className="font-semibold text-primary uppercase">{relatedPost.category}</span>
                          <span>{relatedPost.date}</span>
                        </div>
                        <h4 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-secondary-text mb-4 flex-grow line-clamp-2">
                          {relatedPost.description}
                        </p>
                        <div className="flex items-center text-sm font-medium text-secondary-text group-hover:text-primary transition-colors">
                          Read article <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
