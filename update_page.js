const fs = require('fs');

let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');

// The new imports for guides and blog
if (!pageContent.includes('import { guides }')) {
    pageContent = pageContent.replace(
        'import { calculators } from "@/data/calculators";',
        'import { calculators } from "@/data/calculators";\nimport { guides } from "@/data/guides";\nimport { blogPosts } from "@/data/blog";'
    );
}

// Ensure Clock is imported
if (!pageContent.includes('Clock')) {
    pageContent = pageContent.replace('ArrowRight', 'ArrowRight, Clock, ShieldCheck, Zap, Lock, HardDrive');
} else {
    pageContent = pageContent.replace('Clock } from "lucide-react";', 'Clock, ShieldCheck, Zap, Lock, HardDrive } from "lucide-react";');
}


const componentBodyStart = pageContent.indexOf('export default function Home() {');
const newComponentBody = `
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
`;

pageContent = pageContent.replace(
    /export default function Home\(\) \{[\s\S]*?const targetCategories = \[\n.*?\{\s*name:\s*"PDF".*?\n.*?\{\s*name:\s*"Images".*?\n.*?\{\s*name:\s*"Text".*?\n.*?\{\s*name:\s*"Developer".*?\n.*?\];/s,
    `export default function Home() {` + newComponentBody
);

// Add Phase 3 components after the Calculators section
const phase3Sections = `
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
                        <Clock className="w-4 h-4 mr-1.5" /> {guide.readingTime}
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
               <p className="text-secondary-text text-sm">Jump right in. We don't ask you to sign up before using our tools.</p>
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
`;

pageContent = pageContent.replace(/\{\/\* Trust Banner \*\/\}[\s\S]*?\n    <\/div>\n  \);\n\}/, phase3Sections);
fs.writeFileSync('src/app/page.tsx', pageContent);
console.log('src/app/page.tsx updated.');
