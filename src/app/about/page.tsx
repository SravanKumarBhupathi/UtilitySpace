import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, FileText, Image as ImageIcon, Type, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About UtilitySpace.online | Free Online Tools & Calculators",
  description: "UtilitySpace.online is a comprehensive collection of free online tools, practical calculators, and helpful guides designed to make your everyday digital tasks simpler and faster.",
  alternates: {
    canonical: "https://utilityspace.online/about"
  }
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Hero / Introduction */}
      <section className="pt-20 pb-16 px-4 border-b border-border bg-card">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            About UtilitySpace.online
          </h1>
          <p className="text-lg md:text-xl text-secondary-text leading-relaxed max-w-3xl mx-auto">
            UtilitySpace.online is a collection of free online tools, practical calculators, and helpful guides designed to make everyday digital tasks simpler.
          </p>
        </div>
      </section>

      {/* Section 1: What is UtilitySpace? */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-6">What is UtilitySpace?</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-secondary-text leading-relaxed space-y-4">
            <p>
              We built UtilitySpace to bring highly useful, everyday digital utilities together in one accessible platform. Our goal is straightforward: to make common digital tasks as easy and seamless as possible without unnecessary hurdles.
            </p>
            <p>
              Whether you need to quickly manipulate a file, perform a complex percentage calculation, or read up on practical technical workflows, we offer a growing repository of free tools, calculators, and guides designed specifically to save you time.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Explore Our Tools */}
      <section className="py-16 px-4 bg-card border-y border-border">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-10 text-center">Explore Our Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <Link href="/tools/pdf" className="group block p-6 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">PDF Tools</h3>
                  <p className="text-secondary-text leading-relaxed text-sm">
                    Compress, merge, split, and manage PDF files quickly. Extract specific pages or delete unnecessary ones securely.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/tools/images" className="group block p-6 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">Image Tools</h3>
                  <p className="text-secondary-text leading-relaxed text-sm">
                    Resize, compress, convert, and edit images right in your browser. Inspect metadata or adjust dimensions to the exact pixel.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/tools/text" className="group block p-6 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Type className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">Text Tools</h3>
                  <p className="text-secondary-text leading-relaxed text-sm">
                    Count words, convert text cases, clean up formatting, and analyze character strings effortlessly.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/tools/developer" className="group block p-6 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">Developer Tools</h3>
                  <p className="text-secondary-text leading-relaxed text-sm">
                    Format JSON, encode URLs, generate UUIDs, compute hashes, and access common development utilities.
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Section 3: Online Calculators */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-6">Online Calculators</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-secondary-text leading-relaxed space-y-4">
            <p>
              In addition to file utilities, we provide a robust suite of practical calculators tailored for both personal and professional scenarios.
            </p>
            <p>
              Whether you are trying to calculate the exact difference between two dates, figuring out an EMI payment, verifying GST, or simply needing an accurate Percentage Calculator, our platform makes the math instant and clear.
            </p>
            <p className="pt-4">
              <Link href="/calculators" className="text-primary font-medium hover:underline inline-flex items-center">
                Browse all calculators <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Guides and Articles */}
      <section className="py-16 px-4 bg-card border-y border-border">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-6">Guides and Articles</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-secondary-text leading-relaxed space-y-4">
            <p>
              Digital literacy matters. We regularly publish practical how-to guides and educational articles that break down technical concepts into accessible, easy-to-follow steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/guides" className="text-primary font-medium hover:underline inline-flex items-center">
                Read our guides <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
              <Link href="/blog" className="text-primary font-medium hover:underline inline-flex items-center">
                Explore the blog <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Our Approach */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-6">Our Approach</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-secondary-text leading-relaxed space-y-4">
            <p>
              We firmly believe that standard utilities shouldn&apos;t be cluttered with excessive advertising or confusing interfaces. Our design philosophy centers around <strong>simplicity</strong>, <strong>accessibility</strong>, and a <strong>clear user experience</strong>.
            </p>
            <p>
              For tools that handle sensitive files (like PDF compressors or Image croppers), we process your data locally right in your browser utilizing HTML5 technologies. We never store files on our servers unnecessarily, ensuring practical usefulness paired with privacy. We are committed to continuous improvement, refining our tools so they work precisely when you need them.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Important CTA & Final Navigation */}
      <section className="py-20 px-4 bg-primary text-white text-center">
        <div className="container mx-auto max-w-3xl space-y-8">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to Get Things Done?
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Explore our collection of free tools, calculators, and helpful resources.
          </p>

          <div className="flex flex-col items-center gap-6 pt-4">
            <Button size="lg" variant="secondary" asChild className="text-primary font-bold px-8 py-6 text-lg hover:bg-white/90">
              <Link href="/">Explore UtilitySpace</Link>
            </Button>

            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-white/80">
              <Link href="/tools" className="hover:text-white transition-colors flex items-center">
                Explore Tools <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
              <Link href="/calculators" className="hover:text-white transition-colors flex items-center">
                Browse Calculators <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
              <Link href="/guides" className="hover:text-white transition-colors flex items-center">
                Read Guides <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
