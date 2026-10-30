"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type BlogPost = {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  date: string;
  readingTime: string;
};

export function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [query, setQuery] = React.useState("");

  const filteredPosts = React.useMemo(() => {
    if (!query.trim()) return initialPosts;
    const lowerQuery = query.toLowerCase();
    return initialPosts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.category.toLowerCase().includes(lowerQuery)
    );
  }, [query, initialPosts]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Latest Articles</h2>
          <p className="text-secondary-text mt-2">More insights and productivity tips.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text" />
          <Input
            placeholder="Search articles..."
            className="pl-9 h-11 bg-background"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-border rounded-xl">
           <p className="text-secondary-text text-lg">No articles found matching &quot;{query}&quot;.</p>
           <button onClick={() => setQuery("")} className="mt-4 text-primary font-medium hover:underline">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <Link key={post.id} href={post.href} className="group block">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col bg-background">
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4 text-sm text-secondary-text font-medium">
                      <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                       {post.title}
                    </h3>
                    <p className="text-secondary-text leading-relaxed text-sm mb-6 line-clamp-3">{post.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-border">
                     <span className="text-secondary-text font-medium flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {post.readingTime}</span>
                     <span className="font-bold text-primary group-hover:underline flex items-center">Read More <ArrowRight className="ml-1 w-4 h-4" /></span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
