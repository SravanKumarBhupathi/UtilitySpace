import Link from "next/link";
import { tools, toolCategories } from "@/data";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image as ImageIcon, Type, Code, GraduationCap, Files } from "lucide-react";

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

export default function ToolsIndex() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          All Tools
        </h1>
        <p className="text-xl text-secondary-text max-w-2xl">
          A complete collection of everyday digital utilities to help you work faster.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="font-heading text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {toolCategories.map(category => (
            <Link key={category.name} href={`/tools/${category.name.toLowerCase()}`} className="group block">
              <Card className="hover:border-primary/50 hover:shadow-md transition-all text-center h-full">
                <CardContent className="p-4 flex flex-col items-center gap-3">
                  <div className="p-2 bg-muted text-secondary-foreground rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {getIcon(category.icon, "w-5 h-5")}
                  </div>
                  <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold mb-6">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map(tool => (
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
                   <span className="mt-4 text-xs font-semibold text-primary uppercase tracking-wider">{tool.category}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
