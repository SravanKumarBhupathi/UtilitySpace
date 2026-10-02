"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Wand2, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function RemoveSpacesTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [removeDuplicateLines, setRemoveDuplicateLines] = useState(false);
  const [sortLines, setSortLines] = useState(false);

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

  const processText = () => {
    if (!text) return;

    let newText = text;
    // Remove extra spaces between words and tabs
    newText = newText.replace(/[ \t]{2,}/g, ' ');

    // Process line by line
    let lines = newText.split('\n').map(line => line.trim());

    if (removeEmptyLines) {
      lines = lines.filter(line => line.length > 0);
    }

    if (removeDuplicateLines) {
      // Keep first occurrence of each line
      lines = lines.filter((line, index) => lines.indexOf(line) === index);
    }

    if (sortLines) {
      lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    }

    setText(lines.join('\n').trim());
  };

  return (
    <ToolLayout
      title="Clean Text"
      description="Clean up text by removing extra spaces, empty lines, and duplicates."
      category="Text"
    >
      <div className="text-center mb-6">
        <p className="text-sm text-secondary-text bg-muted/50 inline-block px-3 py-1 rounded-full border border-border">
          🔒 Your text is processed locally in your browser.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
          <Button onClick={processText} variant="default" size="lg" disabled={!text} className="w-full md:w-auto">
            <Wand2 className="w-4 h-4 mr-2" /> Clean Text
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emptyLines"
                checked={removeEmptyLines}
                onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary accent-primary w-4 h-4"
              />
              <Label htmlFor="emptyLines" className="cursor-pointer">Remove empty lines</Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="duplicateLines"
                checked={removeDuplicateLines}
                onChange={(e) => setRemoveDuplicateLines(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary accent-primary w-4 h-4"
              />
              <Label htmlFor="duplicateLines" className="cursor-pointer">Remove duplicate lines</Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sortLines"
                checked={sortLines}
                onChange={(e) => setSortLines(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary accent-primary w-4 h-4"
              />
              <Label htmlFor="sortLines" className="cursor-pointer">Sort lines</Label>
            </div>
          </div>
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
            className="w-full h-64 md:h-96 p-4 font-mono text-sm border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            placeholder="Paste your messy text here..."
            spellCheck={false}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
