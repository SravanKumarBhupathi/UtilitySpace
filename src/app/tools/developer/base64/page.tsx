"use client";

import { useState } from "react";
import { ToolLayout } from "../../layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, ArrowDownUp } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const process = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
      setError("");
    } catch {
      setOutput("");
      setError(`Invalid input for Base64 ${mode}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const toggleMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError("");
  };

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Safely encode text to Base64 or decode Base64 back to readable text."
      category="Developer"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button onClick={process} variant="default">
              {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
            </Button>
            <Button onClick={toggleMode} variant="outline">
              <ArrowDownUp className="w-4 h-4 mr-2" /> Swap
            </Button>
          </div>
          <div className="flex items-center">
             <span className="text-sm font-medium px-3 py-1 bg-muted rounded-full uppercase tracking-wider text-secondary-text">
               Mode: {mode}
             </span>
          </div>
        </div>

        <div className="space-y-0 relative">
          <div className="flex justify-between items-center bg-card border border-border p-2 rounded-t-lg border-b-0">
             <div className="text-sm font-medium text-secondary-text px-2">Input</div>
             <Button variant="ghost" size="sm" onClick={clear} title="Clear text" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
               <Trash2 className="w-4 h-4 mr-2" /> Clear
             </Button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 p-4 font-mono text-sm border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
            spellCheck={false}
          />
        </div>

        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        ) : output ? (
          <div className="space-y-0 relative animate-in fade-in duration-200">
            <div className="flex justify-between items-center bg-card border border-border p-2 rounded-t-lg border-b-0 bg-muted/30">
               <div className="text-sm font-medium text-secondary-text px-2">Output</div>
               <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copy text" className="h-8">
                 <Copy className="w-4 h-4 mr-2" /> Copy
               </Button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-48 p-4 font-mono text-sm border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none shadow-sm"
              spellCheck={false}
            />
          </div>
        ) : null}
      </div>
    </ToolLayout>
  );
}
