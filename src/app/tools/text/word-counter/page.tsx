"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, CheckCircle2 } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Improved word counting logic that handles punctuation edges and unicode better
  const words = text.trim() ? (text.match(/[\p{L}\p{N}_-]+/gu) || []).length : 0;

  // Character count includes emojis correctly (not just length)
  const characters = Array.from(text).length;

  // Characters without spaces
  const charactersNoSpaces = Array.from(text.replace(/\s+/g, '')).length;

  // Sentences handling more edge cases
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || []).filter(s => s.trim().length > 0).length : 0;

  // Paragraphs
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

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

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in your text."
      category="Text"
    >
      <div className="text-center mb-6">
        <p className="text-sm text-secondary-text bg-muted/50 inline-block px-3 py-1 rounded-full border border-border">
          🔒 Your text is processed locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-0">
          <div className="flex justify-between items-center bg-card border border-border p-2 rounded-t-lg border-b-0">
             <div className="text-sm font-medium text-secondary-text px-2">Text Input</div>
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
            placeholder="Type or paste your text here..."
            spellCheck="false"
          />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary text-white border-primary shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-heading font-bold">{words}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80 mt-1">Words</span>
              </CardContent>
            </Card>
            <Card className="bg-foreground text-background border-foreground shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-heading font-bold">{characters}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-background/80 mt-1">Characters</span>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-sm">
            <CardContent className="p-0 divide-y divide-border">
              <div className="flex justify-between items-center p-4">
                <span className="text-secondary-text text-sm font-medium">Characters (no spaces)</span>
                <span className="font-semibold text-foreground">{charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-secondary-text text-sm font-medium">Sentences</span>
                <span className="font-semibold text-foreground">{sentences}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-secondary-text text-sm font-medium">Paragraphs</span>
                <span className="font-semibold text-foreground">{paragraphs}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
