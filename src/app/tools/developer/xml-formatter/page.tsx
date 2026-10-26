"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Code2, AlertCircle } from "lucide-react";

import { Label } from "@/components/ui/label";

export default function XmlFormatter() {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [indent, setIndent] = useState("  ");
  const [error, setError] = useState<string | null>(null);

  const formatXML = () => {
    if (!text) {
      setProcessedText("");
      setError(null);
      return;
    }

    try {
      // Basic browser-based parser and validation
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "application/xml");

      // Check for parsing errors
      const parserError = xmlDoc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
         setError("Invalid XML: " + parserError[0].textContent);
         setProcessedText("");
         return;
      }

      setError(null);

      // Recursive formatting
      let formatted = '';
      let pad = 0;

      // Clean string by removing inter-tag whitespace
      const cleanXml = text.replace(/(>)\s*(<)/g, "$1$2");

      const lines = cleanXml.split(/(<[^>]+>)/g);
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        let padding = "";
        for (let j = 0; j < pad; j++) padding += indent;

        if (line.match(/^<\?.*\?>$/) || line.match(/^<!.*>$/)) {
            // Header or doctype
            formatted += padding + line + '\n';
        } else if (line.match(/^<\/[^>]+>$/)) {
            // Closing tag
            pad -= 1;
            padding = "";
            for (let j = 0; j < pad; j++) padding += indent;
            formatted += padding + line + '\n';
        } else if (line.match(/^<[^>]+>$/) && !line.match(/^[<].*[\/]$/)) {
            // Opening tag
            formatted += padding + line + '\n';
            pad += 1;
        } else {
            // Text node or self-closing tag
            formatted += padding + line + '\n';
        }
      }

      setProcessedText(formatted.trim());
    } catch (e: any) {
       setError(e.message || "Failed to format XML");
    }
  };

  const minifyXML = () => {
    if (!text) {
      setProcessedText("");
      setError(null);
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "application/xml");
      const parserError = xmlDoc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
         setError("Invalid XML: " + parserError[0].textContent);
         return;
      }
      setError(null);
      const minified = text.replace(/>\s+</g, '><').trim();
      setProcessedText(minified);
    } catch (e: any) {
      setError(e.message || "Failed to minify XML");
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
    setError(null);
  };

  return (
    <ToolLayout
      title="XML Formatter & Validator"
      description="Beautify, format, or minify XML code. Highlights syntax errors automatically."
      category="Developer"
    >
      <div className="space-y-6">

        {/* Controls */}
        <div className="flex flex-wrap gap-4 bg-card border border-border p-4 rounded-xl items-center justify-between">
           <div className="flex items-center gap-4">
             <Button onClick={formatXML}>
               Format XML
             </Button>
             <Button variant="outline" onClick={minifyXML}>
               Minify
             </Button>
           </div>

           <div className="flex items-center space-x-2">
             <Label htmlFor="indent-select" className="text-secondary-text">Indent:</Label>
                <select className="flex h-10 w-[130px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={indent} onChange={(e) => setIndent(e.target.value)}>
                <option value="  ">2 Spaces</option>
                <option value="    ">4 Spaces</option>
                <option value="\t">Tabs</option>
             </select>
           </div>
        </div>

        {error && (
          <div className="flex items-start text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
             <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
             <span className="break-all">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Input XML</label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-[400px] p-4 bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
              placeholder="Paste your XML here..."
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
              className="w-full h-[400px] p-4 bg-muted/50 border border-border rounded-lg resize-none outline-none font-mono text-sm text-green-700 dark:text-green-400 whitespace-pre"
              placeholder="Formatted XML will appear here..."
              value={processedText}
              readOnly
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
