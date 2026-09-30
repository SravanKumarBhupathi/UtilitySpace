import { tools, toolCategories } from "@/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image as ImageIcon, Type, Code, GraduationCap, Files } from "lucide-react";
import { ChevronRight } from "lucide-react";

export function generateStaticParams() {
  return toolCategories.map((category) => ({
    category: category.name.toLowerCase(),
  }));
}

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
    Minimize: <FileText className={className} />
  };
  return icons[name] || <FileText className={className} />;
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryParam = resolvedParams.category;
  const categoryInfo = toolCategories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase());

  if (!categoryInfo) {
    notFound();
  }

  const categoryTools = tools.filter(t => t.category.toLowerCase() === categoryParam.toLowerCase());

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/tools" className="hover:text-primary transition-colors">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{categoryInfo.name}</span>
      </nav>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            {getIcon(categoryInfo.icon, "w-8 h-8")}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {categoryInfo.name} Tools
          </h1>
        </div>
        <p className="text-xl text-secondary-text max-w-2xl">
          {categoryInfo.description}
        </p>
      </header>

      {categoryTools.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryTools.map(tool => (
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
        </section>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-border rounded-xl">
          <p className="text-lg text-secondary-text">No tools available in this category yet.</p>
          <p className="text-sm text-secondary-text mt-2">More tools coming soon!</p>
        </div>
      )}
    </div>
  );
}
