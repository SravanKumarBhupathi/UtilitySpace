const fs = require('fs');

const blogContent = `import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog";
import { BlogListClient } from "./client-list";

export const metadata: Metadata = {
  title: "Blog | Helpful Articles, Tips & Insights - UtilitySpace",
  description: "Explore useful articles, practical tips, and informative guides on UtilitySpace.",
  alternates: {
    canonical: "https://utilityspace.online/blog"
  }
};

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Page Hero */}
      <section className="pt-20 pb-16 px-4 border-b border-border bg-card text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Our Blog
          </h1>
          <p className="text-lg md:text-xl text-secondary-text leading-relaxed max-w-3xl mx-auto">
            Discover helpful articles, practical tips, digital tools, and useful insights to make everyday tasks easier.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-16 px-4 border-b border-border bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-8">Featured Article</h2>
            <Link href={featuredPost.href} className="group block">
              <div className="flex flex-col md:flex-row bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all">
                {/* Fallback image block since we dont have explicit featured images yet */}
                <div className="w-full md:w-1/2 bg-muted p-12 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border text-center">
                   <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                   </div>
                   <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                     {featuredPost.category}
                   </span>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4 text-sm text-secondary-text font-medium">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs uppercase tracking-wider">{featuredPost.category}</span>
                    <span>{featuredPost.date}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {featuredPost.readingTime}</span>
                  </div>
                  <h3 className="font-heading font-bold text-3xl text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {featuredPost.title}
                  </h3>
                  <p className="text-lg text-secondary-text leading-relaxed mb-8 line-clamp-3">
                    {featuredPost.description}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center font-bold text-primary group-hover:underline">
                      Read Article <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Latest Articles + Client Side Search */}
      <section className="py-16 px-4 bg-card">
         <div className="container mx-auto max-w-7xl">
           <BlogListClient initialPosts={remainingPosts} />
         </div>
      </section>

    </div>
  );
}
`;

fs.writeFileSync('src/app/blog/page.tsx', blogContent);

const clientListContent = `"use client";
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
`;

fs.writeFileSync('src/app/blog/client-list.tsx', clientListContent);

// Check if sitemap contains blog
let sitemapContent = fs.readFileSync('src/app/sitemap.ts', 'utf8');
if (!sitemapContent.includes("url: `${baseUrl}/blog`")) {
    sitemapContent = sitemapContent.replace(
        "return [",
        `return [\n    {\n      url: \`\${baseUrl}/blog\`,\n      lastModified: new Date(),\n      changeFrequency: 'weekly',\n      priority: 0.8,\n    },`
    );
    fs.writeFileSync('src/app/sitemap.ts', sitemapContent);
}

console.log("Fixed blog page layout, root cause redirect, and search/filter functionality.");
