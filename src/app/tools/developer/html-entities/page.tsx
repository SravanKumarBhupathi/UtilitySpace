"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Code } from "lucide-react";

export default function HtmlEntities() {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleProcess = () => {
    if (!text) {
      setProcessedText("");
      return;
    }

    if (mode === "encode") {
      // Basic HTML Entity Encoding
      const encoded = text.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
         return '&#'+i.charCodeAt(0)+';';
      });
      setProcessedText(encoded);
    } else {
      // Basic HTML Entity Decoding safely
      const doc = new DOMParser().parseFromString(text, "text/html");
      setProcessedText(doc.documentElement.textContent || "");
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
      title="HTML Entity Encoder/Decoder"
      description="Safely encode special characters to HTML entities, or decode HTML entities back to text."
      category="Developer"
    >
      <div className="space-y-6">

        {/* Controls */}
        <div className="flex flex-wrap gap-4 bg-card border border-border p-4 rounded-xl items-center">
           <Button
             variant={mode === "encode" ? "default" : "outline"}
             onClick={() => setMode("encode")}
           >
             Encode to Entities
           </Button>
           <Button
             variant={mode === "decode" ? "default" : "outline"}
             onClick={() => setMode("decode")}
           >
             Decode from Entities
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Input String</label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-[300px] p-4 bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
              placeholder={mode === "encode" ? "Enter text with special characters like <, >, &..." : "Enter text with HTML entities like &#60;, &amp;..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Result</label>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!processedText} className="h-8 text-xs text-secondary-text">
                <Copy className="w-3 h-3 mr-1" /> Copy Result
              </Button>
            </div>
            <textarea
              className="w-full h-[300px] p-4 bg-muted/50 border border-border rounded-lg resize-none outline-none font-mono text-sm"
              placeholder="Output will appear here..."
              value={processedText}
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center justify-start gap-4">
           <Button onClick={handleProcess} size="lg" className="w-full sm:w-auto">
             <Code className="w-4 h-4 mr-2" />
             {mode === "encode" ? "Encode" : "Decode"}
           </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
