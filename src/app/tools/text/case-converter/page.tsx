"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

export default function CaseConverter() {
  const [text, setText] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const clear = () => {
    setText("");
  };

  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());
  const toTitleCase = () => {
    setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  };
  const toSentenceCase = () => {
    setText(text.replace(/(^\w|\.\s*\w)/gi, (c) => c.toUpperCase()));
  };
  const toAlternatingCase = () => {
    setText(text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''));
  };

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text between UPPERCASE, lowercase, Title Case, and more."
      category="Text"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button onClick={toUpperCase} variant="secondary">UPPERCASE</Button>
          <Button onClick={toLowerCase} variant="secondary">lowercase</Button>
          <Button onClick={toTitleCase} variant="secondary">Title Case</Button>
          <Button onClick={toSentenceCase} variant="secondary">Sentence case</Button>
          <Button onClick={toAlternatingCase} variant="secondary">aLtErNaTiNg cAsE</Button>
        </div>
        <div className="space-y-0 relative">
          <div className="flex justify-between items-center bg-card border border-border p-2 rounded-t-lg border-b-0">
             <div className="text-sm font-medium text-secondary-text px-2">Text Content</div>
             <div className="flex gap-2">
               <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copy text" className="h-8">
                 <Copy className="w-4 h-4 mr-2" /> Copy
               </Button>
               <Button variant="ghost" size="sm" onClick={clear} title="Clear text" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                 <Trash2 className="w-4 h-4 mr-2" /> Clear
               </Button>
             </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 md:h-96 p-4 border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            placeholder="Type or paste your text here to convert..."
          />
        </div>
      </div>
    </ToolLayout>
  );
}
