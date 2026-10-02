"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2 } from "lucide-react";

export default function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const [slug, setSlug] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateSlug(input, separator);
  }, [input, separator]);

  const generateSlug = (text: string, sep: string) => {
    if (!text) {
      setSlug("");
      return;
    }
    const result = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^\w\s-]/g, "") // remove non-word chars
      .trim()
      .replace(/\s+/g, sep) // replace spaces with separator
      .replace(new RegExp(`\\${sep}+`, "g"), sep); // remove multiple separators

    setSlug(result);
  };

  const copyToClipboard = async () => {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const clear = () => {
    setInput("");
    setSlug("");
    setCopied(false);
  };

  return (
    <ToolLayout
      title="Slug Generator"
      description="Convert any string into a clean, URL-friendly slug instantly."
      category="Text"
    >
      <div className="text-center mb-6">
        <p className="text-sm text-secondary-text bg-muted/50 inline-block px-3 py-1 rounded-full border border-border">
          🔒 Your text is processed locally in your browser.
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="space-y-3">
          <Label htmlFor="input" className="text-lg">Original Text</Label>
          <Input
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. This is a Great Title for a Blog Post!"
            className="text-base h-12"
          />
        </div>

        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="separator"
              checked={separator === "-"}
              onChange={() => setSeparator("-")}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm font-medium">Hyphens (this-is-a-slug)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="separator"
              checked={separator === "_"}
              onChange={() => setSeparator("_")}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm font-medium">Underscores (this_is_a_slug)</span>
          </label>

          <Button onClick={clear} variant="ghost" className="text-secondary-text ml-auto" disabled={!input}>Clear</Button>
        </div>

        <div className="p-6 bg-muted/30 rounded-xl border border-border mt-8">
           <div className="flex justify-between items-center mb-3">
             <Label className="text-lg">URL Slug</Label>
           </div>
           <div className="flex gap-2 relative">
             <Input
               value={slug}
               readOnly
               className="font-mono text-primary bg-background h-14 text-lg pr-24"
               placeholder="your-slug-will-appear-here"
             />
             <Button
               variant="default"
               className="absolute right-1 top-1 bottom-1 h-12"
               onClick={copyToClipboard}
               title="Copy slug"
               disabled={!slug}
             >
               {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
               {copied ? "Copied" : "Copy"}
             </Button>
           </div>
        </div>
      </div>
    </ToolLayout>
  );
}
