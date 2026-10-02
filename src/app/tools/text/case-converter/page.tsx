"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, CheckCircle2 } from "lucide-react";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const clear = () => {
    setText("");
    setCopied(false);
  };

  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());
  const toTitleCase = () => {
    setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  };
  const toSentenceCase = () => {
    // Robust sentence case: Capitalize first letter of string and first letter after a terminal punctuation + spaces
    setText(text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (c) => c.toUpperCase()));
  };
  const toAlternatingCase = () => {
    setText(text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''));
  };
  const toInverseCase = () => {
    setText(text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''));
  };
  const toCamelCase = () => {
    setText(text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    }));
  };
  const toPascalCase = () => {
    setText(text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
      if (+match === 0) return "";
      return match.toUpperCase();
    }));
  };
  const toSnakeCase = () => {
    setText(text.replace(/\W+/g, " ").trim().split(" ").join("_").toLowerCase());
  };

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and more."
      category="Text"
    >
      <div className="text-center mb-6">
        <p className="text-sm text-secondary-text bg-muted/50 inline-block px-3 py-1 rounded-full border border-border">
          🔒 Your text is processed locally in your browser.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={toUpperCase} variant="secondary" disabled={!text}>UPPERCASE</Button>
          <Button onClick={toLowerCase} variant="secondary" disabled={!text}>lowercase</Button>
          <Button onClick={toTitleCase} variant="secondary" disabled={!text}>Title Case</Button>
          <Button onClick={toSentenceCase} variant="secondary" disabled={!text}>Sentence case</Button>
          <Button onClick={toAlternatingCase} variant="secondary" disabled={!text}>aLtErNaTiNg cAsE</Button>
          <Button onClick={toInverseCase} variant="secondary" disabled={!text}>iNVERSE cASE</Button>
          <Button onClick={toCamelCase} variant="secondary" disabled={!text}>camelCase</Button>
          <Button onClick={toPascalCase} variant="secondary" disabled={!text}>PascalCase</Button>
          <Button onClick={toSnakeCase} variant="secondary" disabled={!text}>snake_case</Button>
        </div>
        <div className="space-y-0 relative">
          <div className="flex justify-between items-center bg-card border border-border p-2 rounded-t-lg border-b-0">
             <div className="text-sm font-medium text-secondary-text px-2">Text Content</div>
             <div className="flex gap-2">
               <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copy text" className="h-8" disabled={!text}>
                 {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-success" /> : <Copy className="w-4 h-4 mr-2" />}
                 {copied ? "Copied" : "Copy"}
               </Button>
               <Button variant="ghost" size="sm" onClick={clear} title="Clear text" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50" disabled={!text}>
                 <Trash2 className="w-4 h-4 mr-2" /> Clear
               </Button>
             </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 md:h-96 p-4 border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            placeholder="Type or paste your text here to convert..."
            spellCheck="false"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
