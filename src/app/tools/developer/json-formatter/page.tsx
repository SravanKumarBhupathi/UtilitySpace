"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JsonFormatter() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const formatJSON = () => {
    if (!text.trim()) {
      setStatus("idle");
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed, null, 2));
      setStatus("valid");
      setErrorMessage("");
    } catch (e: unknown) {
      setStatus("invalid");
      setErrorMessage(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const minifyJSON = () => {
    if (!text.trim()) return;
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed));
      setStatus("valid");
      setErrorMessage("");
    } catch (e: unknown) {
      setStatus("invalid");
      setErrorMessage(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const clear = () => {
    setText("");
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Beautify, format, and validate JSON data."
      category="Developer"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button onClick={formatJSON} variant="default">Format (Beautify)</Button>
            <Button onClick={minifyJSON} variant="secondary">Minify</Button>
          </div>
          <div className="flex items-center">
            {status === "valid" && (
              <span className="flex items-center text-sm text-success font-medium">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Valid JSON
              </span>
            )}
            {status === "invalid" && (
              <span className="flex items-center text-sm text-red-500 font-medium">
                <AlertCircle className="w-4 h-4 mr-1" /> {errorMessage}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-0 relative">
          <div className="flex justify-between items-center bg-card border border-border p-2 rounded-t-lg border-b-0">
             <div className="text-sm font-medium text-secondary-text px-2">JSON Content</div>
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
            onChange={(e) => {
              setText(e.target.value);
              setStatus("idle");
            }}
            className={cn(
              "w-full h-96 md:h-[500px] p-4 font-mono text-sm border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm",
              status === "invalid" && "border-red-500 focus-visible:ring-red-500"
            )}
            placeholder='{"key": "value"}'
            spellCheck={false}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
