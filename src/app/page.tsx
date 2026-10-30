"use client";

import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Zap, Lock, HardDrive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { tools } from "@/data/tools";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { blogPosts } from "@/data/blog";
import { toolCategories } from "@/data/categories";
import { getIcon } from "@/lib/icons";

export default function Home() {
  const popularTools = [
    "compressor", // PDF
    "merger",     // PDF
    "image-compressor",
    "image-converter",
    "word-counter",
    "case-converter",
    "json-formatter",
    "uuid-generator"
  ].map(id => tools.find(t => t.id === id)).filter(Boolean);

  const featuredCalculators = [
    "age",
    "percentage",
    "emi",
    "gst",
    "discount",
    "date-difference",
    "simple-interest",
    "profit-loss"
  ].map(id => calculators.find(c => c.id === id)).filter(Boolean);

  const featuredGuides = [
    "how-to-compress-a-pdf",
    "how-to-resize-an-image",
    "how-to-convert-images",
    "how-to-calculate-percentages"
  ].map(id => guides.find(g => g.id === id)).filter(Boolean);

  const recentPosts = blogPosts.slice(0, 3);

  const targetCategories = [
    { name: "PDF", desc: "Compress, merge, split, and manage PDF files.", href: "/tools/pdf" },
    { name: "Images", desc: "Resize, compress, convert, and edit images.", href: "/tools/images" },
    { name: "Text", desc: "Count words, convert text cases, compare and clean text.", href: "/tools/text" },
    { name: "Developer", desc: "Format JSON, encode URLs, generate hashes, and use development utilities.", href: "/tools/developer" }
  ];


  return (
    <div className="flex flex-col min-h-screen">
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

      {/* Tool Categories */}
      <section className="py-16 bg-card px-4 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-10">Explore Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetCategories.map(cat => {
              const fullCategory = toolCategories.find(c => c.name === cat.name);
              const count = tools.filter(t => t.category === cat.name).length;
              return (
                <Link key={cat.name} href={cat.href} className="group block">
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col bg-background">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                        {getIcon(fullCategory?.icon || "Code", "w-6 h-6")}
                      </div>
                      <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                        {cat.name} Tools
                      </h3>
                      <p className="text-secondary-text leading-relaxed text-sm mb-6 flex-1">
                        {cat.desc}
                      </p>
                      <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-border">
                         <span className="font-medium text-secondary-text">{count} tools</span>
                         <span className="font-medium text-primary flex items-center group-hover:underline">Explore <ArrowRight className="ml-1 w-4 h-4" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-16 bg-background px-4 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Popular Tools</h2>
              <p className="text-secondary-text mt-2">Our most frequently used utilities.</p>
            </div>
            <Button variant="outline" asChild className="group shrink-0">
              <Link href="/tools">Explore All Tools <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map(tool => tool && (
              <Link key={tool.id} href={tool.href} className="group block">
                <Card className="h-full hover:border-primary/50 transition-all bg-card">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                       {getIcon(tool.icon || "", "w-6 h-6")}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-1">
                         {tool.title}
                      </h3>
                      <p className="text-sm text-secondary-text line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free Online Calculators */}
      <section className="py-16 bg-card px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Free Online Calculators</h2>
              <p className="text-secondary-text mt-2">Quick and accurate calculations for everyday needs.</p>
            </div>
            <Button variant="outline" asChild className="group shrink-0">
              <Link href="/calculators">View All Calculators <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCalculators.map(calc => calc && (
              <Link key={calc.id} href={calc.href} className="group block">
                <Card className="h-full hover:border-primary/50 transition-all bg-background">
                  <CardContent className="p-5 flex flex-col">
                    <div className="w-10 h-10 bg-muted text-secondary-foreground rounded-md flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                       {getIcon(calc.icon || "Calculator", "w-5 h-5")}
                    </div>
                    <h3 className="font-heading font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2">
                       {calc.title}
                    </h3>
                    <p className="text-sm text-secondary-text line-clamp-2">
                      {calc.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Helpful Guides */}
      <section className="py-16 bg-background px-4 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Helpful Guides</h2>
              <p className="text-secondary-text mt-2">Simple guides to help you get things done faster.</p>
            </div>
            <Button variant="outline" asChild className="group shrink-0">
              <Link href="/guides">Explore All Guides <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGuides.map(guide => guide && (
              <Link key={guide.id} href={guide.href} className="group block">
                <Card className="h-full hover:border-primary/50 transition-all bg-card">
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{guide.category}</p>
                      <h3 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-secondary-text leading-relaxed line-clamp-2 mb-4">
                        {guide.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-border">
                      <span className="font-medium text-secondary-text flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" /> {'readingTime' in guide ? String(guide.readingTime) : ''}
                      </span>
                      <span className="font-medium text-primary flex items-center group-hover:underline">
                        Read Guide <ArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Insights & Articles */}
      <section className="py-16 bg-card px-4 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Latest Insights & Articles</h2>
              <p className="text-secondary-text mt-2">Thoughts, tips, and updates on making digital tasks easier.</p>
            </div>
            <Button variant="outline" asChild className="group shrink-0">
              <Link href="/blog">Explore All Articles <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map(post => (
              <Link key={post.id} href={post.href} className="group block">
                <Card className="h-full hover:border-primary/50 transition-all bg-background">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4 text-sm text-secondary-text">
                      <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                       {post.title}
                    </h3>
                    <p className="text-secondary-text leading-relaxed text-sm mb-6 flex-1 line-clamp-3">{post.description}</p>
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

      {/* Trust & Privacy Benefits */}
      <section className="py-16 bg-background px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                 <Zap className="w-6 h-6" />
               </div>
               <h3 className="font-heading font-semibold text-lg text-foreground mb-2">Free online tools</h3>
               <p className="text-sm text-secondary-text">Access our complete collection of utilities without paying a dime.</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <h3 className="font-heading font-semibold text-lg text-foreground mb-2">Simple and easy-to-use</h3>
               <p className="text-sm text-secondary-text">Clean interfaces designed to get your tasks done instantly.</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                 <Lock className="w-6 h-6" />
               </div>
               <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No account required</h3>
               <p className="text-secondary-text text-sm">Jump right in. We don&apos;t ask you to sign up before using our tools.</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                 <HardDrive className="w-6 h-6" />
               </div>
               <h3 className="font-heading font-semibold text-lg text-foreground mb-2">Browser-based processing</h3>
               <p className="text-secondary-text text-sm">Files stay on your device for verified client-side tools.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
