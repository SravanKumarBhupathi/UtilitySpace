"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { blogPosts } from "@/data/blog";
import { tools } from "@/data/tools";
import { calculators } from "@/data/calculators";
const popularTools = tools;
const popularCalculators = calculators;
import { guides } from "@/data/guides";
import { getIcon } from "@/lib/icons";

export default function Home() {
  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1, 7);
  const featuredGuides = guides.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Editorial Hero */}

      {/* Hero Section */}
      <section className="bg-background pt-24 pb-16 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Free Online Tools That Make Life Easier
          </h1>
          <p className="text-lg md:text-xl text-secondary-text leading-relaxed max-w-2xl mx-auto">
            Compress files, edit images, format text, calculate values, and get things done online — quickly and easily.
          </p>

          <div className="max-w-2xl mx-auto mt-8">
            <div
              className="flex items-center space-x-2 border-2 border-primary/20 rounded-full px-6 py-4 bg-card hover:border-primary/50 transition-colors cursor-pointer shadow-sm"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-global-search'));
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-text"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span className="text-lg text-secondary-text flex-1 text-left">Search tools, calculators, and guides...</span>
              <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-sm font-medium text-secondary-text">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['PDF Compressor', 'Image Compressor', 'Word Counter', 'JSON Formatter', 'Percentage Calculator'].map(term => (
                 <button
                   key={term}
                   onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-global-search', { detail: { query: term } }));
                   }}
                   className="text-sm px-4 py-2 rounded-full bg-muted border border-border text-secondary-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                 >
                   {term}
                 </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Discovery */}
      <section className="py-16 bg-card px-4 border-y border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Latest articles</h2>
              <p className="text-secondary-text mt-2">More insights and productivity tips.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map(post => (
              <Link key={post.id} href={post.href} className="group block">
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col bg-background">
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4 text-sm text-secondary-text">
                        <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">{post.category}</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                         {post.title}
                      </h3>
                      <p className="text-secondary-text leading-relaxed text-sm mb-6 line-clamp-3">{post.description}</p>
                    </div>
                    <div className="flex items-center text-sm font-medium text-primary group-hover:underline mt-auto pt-4 border-t border-border">
                       Read article <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Useful Resources */}
      <section className="py-16 bg-background px-4">
        <div className="container mx-auto max-w-7xl space-y-16">

          {/* Top Guides */}
          <div>
             <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
               <div>
                 <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Practical guides</h2>
                 <p className="text-secondary-text mt-1">Simple explanations for digital tasks.</p>
               </div>
               <Button variant="ghost" asChild className="text-primary">
                 <Link href="/guides">All guides <ArrowRight className="ml-2 w-4 h-4" /></Link>
               </Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {featuredGuides.map(guide => (
                 <Link key={guide.id} href={guide.href} className="group block">
                   <Card className="hover:border-primary/50 hover:shadow-sm transition-all bg-card">
                     <CardContent className="p-5 flex items-center justify-between">
                       <div>
                         <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{guide.category}</p>
                         <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {guide.title}
                         </h3>
                       </div>
                       <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
                     </CardContent>
                   </Card>
                 </Link>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Quick Tools */}
            <div>
               <div className="mb-6 flex items-center justify-between">
                 <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Essential Tools</h2>
                 <Link href="/tools" className="text-sm font-medium text-primary hover:underline">View all</Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {popularTools.slice(0, 4).map(tool => (
                   <Link key={tool.id} href={tool.href} className="group block">
                     <Card className="h-full hover:border-primary/50 transition-all bg-card">
                       <CardContent className="p-4 flex items-center gap-3">
                          <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                             {getIcon(tool.icon || "", "w-5 h-5")}
                          </div>
                          <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                             {tool.title}
                          </h3>
                       </CardContent>
                     </Card>
                   </Link>
                 ))}
               </div>
            </div>

            {/* Quick Calculators */}
            <div>
               <div className="mb-6 flex items-center justify-between">
                 <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Calculators</h2>
                 <Link href="/calculators" className="text-sm font-medium text-primary hover:underline">View all</Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {popularCalculators.slice(0, 4).map(calc => (
                   <Link key={calc.id} href={calc.href} className="group block">
                     <Card className="h-full hover:border-primary/50 transition-all bg-card">
                       <CardContent className="p-4 flex items-center gap-3">
                          <div className="p-2 bg-muted text-secondary-foreground rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                             {getIcon(calc.icon || "", "w-5 h-5")}
                          </div>
                          <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                             {calc.title}
                          </h3>
                       </CardContent>
                     </Card>
                   </Link>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-primary text-white px-4 text-center mt-auto">
        <div className="container mx-auto max-w-3xl space-y-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
            Privacy first, always.
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Most of our tools process files entirely in your browser. No hidden tracking, no unnecessary accounts.
          </p>
        </div>
      </section>

    </div>
  );
}
