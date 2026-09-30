"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

export default function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const [slug, setSlug] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");

  const generateSlug = () => {
    const result = input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^\w\s-]/g, "") // remove non-word chars
      .trim()
      .replace(/\s+/g, separator) // replace spaces with separator
      .replace(new RegExp(`\\${separator}+`, "g"), separator); // remove multiple separators

    setSlug(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slug);
  };

  const clear = () => {
    setInput("");
    setSlug("");
  };

  return (
    <ToolLayout
      title="Slug Generator"
      description="Convert any string into a clean, URL-friendly slug."
      category="Text"
    >
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="input">Original Text</Label>
          <Input
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. This is a Great Title for a Blog Post!"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="separator"
              checked={separator === "-"}
              onChange={() => setSeparator("-")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Hyphens (this-is-a-slug)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="separator"
              checked={separator === "_"}
              onChange={() => setSeparator("_")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Underscores (this_is_a_slug)</span>
          </label>
        </div>

        <div className="flex gap-2">
          <Button onClick={generateSlug} className="w-full sm:w-auto">Generate Slug</Button>
          <Button onClick={clear} variant="ghost" className="text-secondary-text">Clear</Button>
        </div>

        {slug && (
          <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 animate-in fade-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-2">
               <Label>URL Slug</Label>
             </div>
             <div className="flex gap-2">
               <Input value={slug} readOnly className="font-mono text-primary bg-background" />
               <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy slug">
                 <Copy className="w-4 h-4" />
               </Button>
             </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
