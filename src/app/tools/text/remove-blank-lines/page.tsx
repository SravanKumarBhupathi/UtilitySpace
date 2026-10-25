"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, AlignLeft } from "lucide-react";

export default function RemoveBlankLines() {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [removedCount, setRemovedCount] = useState(0);

  const handleProcess = () => {
    if (!text) {
      setProcessedText("");
      setRemovedCount(0);
      return;
    }

    const lines = text.split(/\r?\n/);
    const nonBlankLines = lines.filter(line => line.trim().length > 0);

    setProcessedText(nonBlankLines.join('\n'));
    setRemovedCount(lines.length - nonBlankLines.length);
  };

  const handleCopy = () => {
    if (processedText) {
      navigator.clipboard.writeText(processedText);
    }
  };

  const handleClear = () => {
    setText("");
    setProcessedText("");
    setRemovedCount(0);
  };

  return (
    <ToolLayout
      title="Remove Blank Lines"
      description="Clean up text by automatically removing all empty or whitespace-only lines."
      category="Text"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Original Text</label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-[400px] p-4 bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
              placeholder="Paste text with blank lines here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Processed Text</label>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!processedText} className="h-8 text-xs text-secondary-text">
                <Copy className="w-3 h-3 mr-1" /> Copy Result
              </Button>
            </div>
            <textarea
              className="w-full h-[400px] p-4 bg-muted/50 border border-border rounded-lg resize-none outline-none font-mono text-sm"
              placeholder="Clean text will appear here..."
              value={processedText}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl">
           <Button onClick={handleProcess} size="lg" className="w-full sm:w-auto">
             <AlignLeft className="w-4 h-4 mr-2" /> Remove Blank Lines
           </Button>

           {removedCount > 0 && (
             <div className="bg-success/10 text-success border border-success/20 px-4 py-2 rounded-md text-sm font-medium">
                {removedCount} blank {removedCount === 1 ? 'line' : 'lines'} removed
             </div>
           )}
           {removedCount === 0 && processedText && (
             <div className="bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 px-4 py-2 rounded-md text-sm font-medium">
                No blank lines found
             </div>
           )}
        </div>
      </div>
    </ToolLayout>
  );
}
