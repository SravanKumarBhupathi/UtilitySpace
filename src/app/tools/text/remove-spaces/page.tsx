"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Wand2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function RemoveSpacesTool() {
  const [text, setText] = useState("");
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const clear = () => {
    setText("");
  };

  const processText = () => {
    let newText = text;
    // Remove extra spaces between words
    newText = newText.replace(/[ \t]{2,}/g, ' ');
    // Trim each line
    newText = newText.split('\n').map(line => line.trim()).join('\n');

    if (removeEmptyLines) {
      newText = newText.replace(/\n{2,}/g, '\n');
    }

    setText(newText.trim());
  };

  return (
    <ToolLayout
      title="Remove Extra Spaces"
      description="Clean up text by removing extra spaces, tabs, and empty lines."
      category="Text"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button onClick={processText} variant="default" size="lg">
            <Wand2 className="w-4 h-4 mr-2" /> Clean Text
          </Button>

          <div className="flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-md">
            <input
              type="checkbox"
              id="emptyLines"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <Label htmlFor="emptyLines" className="cursor-pointer">Remove empty lines</Label>
          </div>
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
            className="w-full h-64 md:h-96 p-4 font-mono text-sm border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            placeholder="Paste your messy text here..."
            spellCheck={false}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
