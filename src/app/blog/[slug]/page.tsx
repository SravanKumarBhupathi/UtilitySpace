
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog";
import { blogContent } from "@/data/blog-content";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = blogPosts.find((p) => p.id === params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | UtilitySpace Blog`,
    description: post.description,
    alternates: {
      canonical: `https://utilityspace.online/blog/${post.id}`,
    },
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.id,
  }));
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts.find((p) => p.id === params.slug);
  const content = blogContent[params.slug];

  if (!post || !content) {
    notFound();
  }

  const relatedArticles = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  if (relatedArticles.length === 0) {
     // fallback to any
     relatedArticles.push(...blogPosts.filter(p => p.id !== post.id).slice(0, 3));
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-4xl py-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-text mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{post.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="truncate max-w-[200px] sm:max-w-[300px] text-muted-foreground">{post.title}</span>
        </nav>

        <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

          <header className="p-8 md:p-12 border-b border-border text-center bg-muted/30">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              {post.category}
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-secondary-text leading-relaxed max-w-2xl mx-auto mb-8">
              {post.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-secondary-text font-medium">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {post.readingTime}</span>
            </div>
          </header>

          <div className="p-8 md:p-12">
            <div
              className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: typeof content === "string" ? content : content.html }}
            />
          </div>

        </article>

        {/* Post Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 py-6 border-y border-border">
          <Button variant="ghost" asChild className="text-secondary-text hover:text-foreground">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
            </Link>
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" /> Share Article
          </Button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 mb-8">
            <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link key={rel.id} href={rel.href} className="group block">
                  <div className="bg-card border border-border rounded-xl p-5 h-full flex flex-col hover:border-primary/50 hover:shadow-md transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                      {rel.category}
                    </span>
                    <h4 className="font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <div className="mt-auto pt-4 flex items-center text-xs text-secondary-text font-medium">
                      <Clock className="w-3 h-3 mr-1" /> {rel.readingTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
