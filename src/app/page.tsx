"use client";

import Link from "next/link";
import { Search, ArrowRight, FileText, Image as ImageIcon, Type, Code, GraduationCap, Files, Percent, CalendarDays, Tags, Calculator as CalcIcon, Receipt } from "lucide-react";
import { tools, calculators, guides, toolCategories } from "@/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getIcon = (name: string, className?: string) => {
  const icons: Record<string, React.ReactNode> = {
    FileText: <FileText className={className} />,
    Image: <ImageIcon className={className} />,
    ImageMinus: <ImageIcon className={className} />,
    Maximize: <ImageIcon className={className} />,
    Type: <Type className={className} />,
    CaseSensitive: <Type className={className} />,
    Code: <Code className={className} />,
    Braces: <Code className={className} />,
    GraduationCap: <GraduationCap className={className} />,
    Files: <Files className={className} />,
    Minimize: <FileText className={className} />,
    Percent: <Percent className={className} />,
    CalendarDays: <CalendarDays className={className} />,
    Tags: <Tags className={className} />,
    Calculator: <CalcIcon className={className} />,
    Receipt: <Receipt className={className} />,
  };
  return icons[name] || <FileText className={className} />;
};

export default function Home() {
  const popularTools = tools.filter(t => t.isPopular).slice(0, 8);
  const popularCalculators = calculators.filter(c => c.isPopular).slice(0, 4);
  const featuredGuides = guides.slice(0, 4);

  const openSearch = (query?: string) => {
    // Custom event to trigger global search opening
    const event = new CustomEvent("open-global-search", { detail: { query } });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-background pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Useful tools for everyday digital tasks.
          </h1>
          <p className="text-lg md:text-xl text-secondary-text max-w-2xl mx-auto leading-relaxed">
            Convert, calculate, organize and understand things faster with simple tools and practical guides.
          </p>

          <div className="pt-8 max-w-2xl mx-auto">
             <div className="relative group cursor-text" onClick={() => openSearch()}>
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-secondary-text group-hover:text-primary transition-colors" />
               </div>
               <input
                 type="text"
                 placeholder="What do you need help with?"
                 className="block w-full pl-12 pr-4 py-4 md:py-5 border border-border rounded-xl text-base md:text-lg shadow-sm bg-card hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-text"
                 readOnly
               />
               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-xs font-medium text-secondary-text">
                    ⌘ K
                  </kbd>
               </div>
             </div>

             <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-secondary-text font-medium">Popular:</span>
                {["PDF to Word", "Compress PDF", "JPG to PDF", "Percentage", "Age Calculator"].map(term => (
                  <button
                    key={term}
                    onClick={() => openSearch(term)}
                    className="px-3 py-1 bg-muted text-secondary-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card px-4 border-y border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Categories</h2>
            <p className="text-secondary-text mt-2">Explore our collection of everyday tools.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCategories.map(category => (
              <Link key={category.name} href={`/tools/${category.name.toLowerCase()}`} className="group block">
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                      {getIcon(category.icon, "w-6 h-6")}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-secondary-text mt-1">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Popular tools</h2>
              <p className="text-secondary-text mt-2">Our most used everyday utilities.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/tools">View all tools <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTools.map(tool => (
              <Link key={tool.id} href={tool.href} className="group block">
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col">
                  <CardContent className="p-6 flex flex-col h-full">
                     <div className="mb-4 text-secondary-text group-hover:text-primary transition-colors">
                        {getIcon(tool.icon || "", "w-8 h-8")}
                     </div>
                     <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {tool.title}
                     </h3>
                     <p className="text-sm text-secondary-text flex-1">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card px-4 border-y border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Calculators that just work.</h2>
              <p className="text-secondary-text mt-2">Quick answers without the hassle.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/calculators">View all calculators <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCalculators.map(calc => (
              <Link key={calc.id} href={calc.href} className="group block">
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all flex flex-col">
                  <CardContent className="p-6 flex items-center gap-4">
                     <div className="p-2.5 bg-muted text-secondary-foreground rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {getIcon(calc.icon || "", "w-5 h-5")}
                     </div>
                     <div>
                       <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                          {calc.title}
                       </h3>
                     </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Practical guides</h2>
              <p className="text-secondary-text mt-2">Simple explanations for everyday digital tasks.</p>
            </div>
            <Button variant="ghost" asChild className="text-primary hover:text-primary/80 hover:bg-primary/10">
              <Link href="/guides">More guides <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGuides.map(guide => (
              <Link key={guide.id} href={guide.href} className="group block">
                <Card className="hover:border-primary/50 hover:shadow-md transition-all">
                  <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{guide.category}</p>
                      <h3 className="font-heading font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                         {guide.title}
                      </h3>
                      <p className="text-sm text-secondary-text">{guide.description}</p>
                    </div>
                    <div className="hidden sm:flex p-3 bg-muted rounded-full group-hover:bg-primary group-hover:text-white transition-colors text-secondary-foreground">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white px-4 text-center">
        <div className="container mx-auto max-w-3xl space-y-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
            Privacy first, always.
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Most of our tools process files entirely in your browser. When a server is required, files are automatically deleted after processing. No hidden tracking, no unnecessary accounts.
          </p>
        </div>
      </section>

    </div>
  );
}
