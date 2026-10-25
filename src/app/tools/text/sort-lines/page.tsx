"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SortLines() {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [descending, setDescending] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const handleProcess = () => {
    if (!text) {
      setProcessedText("");
      return;
    }

    let lines = text.split(/\r?\n/);

    lines.sort((a, b) => {
       const strA = caseSensitive ? a : a.toLowerCase();
       const strB = caseSensitive ? b : b.toLowerCase();

       if (strA < strB) return descending ? 1 : -1;
       if (strA > strB) return descending ? -1 : 1;
       return 0;
    });

    setProcessedText(lines.join('\n'));
  };

  const handleCopy = () => {
    if (processedText) {
      navigator.clipboard.writeText(processedText);
    }
  };

  const handleClear = () => {
    setText("");
    setProcessedText("");
  };

  return (
    <ToolLayout
      title="Sort Lines"
      description="Sort text lines alphabetically (A-Z or Z-A). Processes instantly in your browser."
      category="Text"
    >
      <div className="space-y-6">

        {/* Controls */}
        <div className="flex flex-wrap gap-6 bg-card border border-border p-4 rounded-xl items-center">
           <div className="flex items-center space-x-2">
             <Switch
               id="descending"
               checked={descending}
               onCheckedChange={setDescending}
             />
             <Label htmlFor="descending" className="cursor-pointer">Sort Z-A (Descending)</Label>
           </div>

           <div className="flex items-center space-x-2">
             <Switch
               id="case-sensitive"
               checked={caseSensitive}
               onCheckedChange={setCaseSensitive}
             />
             <Label htmlFor="case-sensitive" className="cursor-pointer">Case Sensitive</Label>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Original List</label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-[400px] p-4 bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
              placeholder="Paste lines to sort here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Sorted Result</label>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!processedText} className="h-8 text-xs text-secondary-text">
                <Copy className="w-3 h-3 mr-1" /> Copy Result
              </Button>
            </div>
            <textarea
              className="w-full h-[400px] p-4 bg-muted/50 border border-border rounded-lg resize-none outline-none font-mono text-sm"
              placeholder="Sorted lines will appear here..."
              value={processedText}
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center justify-start gap-4">
           <Button onClick={handleProcess} size="lg" className="w-full sm:w-auto">
             {descending ? <ArrowUpZA className="w-4 h-4 mr-2" /> : <ArrowDownAZ className="w-4 h-4 mr-2" />}
             Sort Lines
           </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
