"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, ArrowLeftRight } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function ReverseText() {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [mode, setMode] = useState<"characters" | "words" | "lines">("characters");

  const handleProcess = () => {
    if (!text) {
      setProcessedText("");
      return;
    }

    if (mode === "characters") {
       setProcessedText(text.split('').reverse().join(''));
    } else if (mode === "words") {
       const lines = text.split(/\r?\n/);
       const reversedLines = lines.map(line => line.split(/\s+/).reverse().join(' '));
       setProcessedText(reversedLines.join('\n'));
    } else if (mode === "lines") {
       setProcessedText(text.split(/\r?\n/).reverse().join('\n'));
    }
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
      title="Reverse Text"
      description="Reverse text by characters, words, or lines. Processes instantly in your browser."
      category="Text"
    >
      <div className="space-y-6">

        {/* Controls */}
        <div className="flex flex-wrap gap-6 bg-card border border-border p-4 rounded-xl items-center">
           <div className="flex items-center space-x-2">
             <input type="radio" id="mode-char" name="mode" checked={mode === 'characters'} onChange={() => setMode('characters')} className="cursor-pointer" />
             <Label htmlFor="mode-char" className="cursor-pointer">Reverse Characters</Label>
           </div>

           <div className="flex items-center space-x-2">
             <input type="radio" id="mode-word" name="mode" checked={mode === 'words'} onChange={() => setMode('words')} className="cursor-pointer" />
             <Label htmlFor="mode-word" className="cursor-pointer">Reverse Words</Label>
           </div>

           <div className="flex items-center space-x-2">
             <input type="radio" id="mode-line" name="mode" checked={mode === 'lines'} onChange={() => setMode('lines')} className="cursor-pointer" />
             <Label htmlFor="mode-line" className="cursor-pointer">Reverse Lines</Label>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Original Text</label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-[300px] p-4 bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
              placeholder="Paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Reversed Result</label>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!processedText} className="h-8 text-xs text-secondary-text">
                <Copy className="w-3 h-3 mr-1" /> Copy Result
              </Button>
            </div>
            <textarea
              className="w-full h-[300px] p-4 bg-muted/50 border border-border rounded-lg resize-none outline-none font-mono text-sm"
              placeholder="Reversed text will appear here..."
              value={processedText}
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center justify-start gap-4">
           <Button onClick={handleProcess} size="lg" className="w-full sm:w-auto">
             <ArrowLeftRight className="w-4 h-4 mr-2" />
             Reverse Text
           </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
