"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, ListMinus } from "lucide-react";

export default function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [duplicateCount, setDuplicateCount] = useState(0);

  const handleProcess = () => {
    if (!text.trim()) {
      setProcessedText("");
      setDuplicateCount(0);
      return;
    }

    // Split by universal newline matching both \n and \r\n
    const lines = text.split(/\r?\n/);
    const uniqueLines = Array.from(new Set(lines));

    setProcessedText(uniqueLines.join('\n'));
    setDuplicateCount(lines.length - uniqueLines.length);
  };

  const handleCopy = () => {
    if (processedText) {
      navigator.clipboard.writeText(processedText);
    }
  };

  const handleClear = () => {
    setText("");
    setProcessedText("");
    setDuplicateCount(0);
  };

  return (
    <ToolLayout
      title="Remove Duplicate Lines"
      description="Quickly identify and remove duplicate lines from your text. Processes locally."
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
              placeholder="Paste your list here..."
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
              placeholder="Unique lines will appear here..."
              value={processedText}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl">
           <Button onClick={handleProcess} size="lg" className="w-full sm:w-auto">
             <ListMinus className="w-4 h-4 mr-2" /> Remove Duplicates
           </Button>

           {duplicateCount > 0 && (
             <div className="bg-success/10 text-success border border-success/20 px-4 py-2 rounded-md text-sm font-medium">
                {duplicateCount} duplicate {duplicateCount === 1 ? 'line' : 'lines'} removed
             </div>
           )}
        </div>
      </div>
    </ToolLayout>
  );
}
