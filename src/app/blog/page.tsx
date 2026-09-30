import Link from "next/link";
import { blogPosts } from "@/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";

export default function BlogIndex() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          The UtilitySpace Blog
        </h1>
        <p className="text-xl text-secondary-text max-w-2xl">
          Thoughts, tips, and updates on making digital tasks easier.
        </p>
      </header>

      <div className="space-y-8">
        {blogPosts.map(post => (
          <Link key={post.id} href={post.href} className="group block">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all border-none shadow-none bg-transparent hover:bg-card">
              <CardContent className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 text-sm text-secondary-text">
                    <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">{post.category}</span>
                    <span>{post.date}</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {post.readingTime}</span>
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                     {post.title}
                  </h3>
                  <p className="text-secondary-text leading-relaxed">{post.description}</p>
                </div>
                <div className="hidden md:flex p-3 bg-muted rounded-full group-hover:bg-primary group-hover:text-white transition-colors text-secondary-foreground shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
