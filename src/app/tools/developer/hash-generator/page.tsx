"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HashGenerator() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": ""
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateHashes() {
      if (!text) {
        setHashes({
          "SHA-1": "",
          "SHA-256": "",
          "SHA-384": "",
          "SHA-512": ""
        });
        setError(null);
        return;
      }

      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
        const newHashes: Record<string, string> = {};

        for (const algo of algos) {
          const hashBuffer = await crypto.subtle.digest(algo, data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          newHashes[algo] = hashHex;
        }

        setHashes(newHashes);
        setError(null);
      } catch (err) {
        setError("Error generating hashes. Your browser may not support Web Crypto API.");
      }
    }

    generateHashes();
  }, [text]);

  const handleCopy = (textToCopy: string) => {
    if (textToCopy) navigator.clipboard.writeText(textToCopy);
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <ToolLayout
      title="Text Hash Generator"
      description="Generate cryptographic hashes (SHA-1, SHA-256, SHA-384, SHA-512) for any text."
      category="Developer"
    >
      <div className="space-y-6">

         <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Input Text</label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-32 p-4 bg-background border border-border focus:ring-primary/50 rounded-lg resize-none outline-none font-mono text-sm"
              placeholder="Enter text to hash..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
         </div>

         {error && <p className="text-red-500 text-sm">{error}</p>}

         <div className="space-y-4">
            {Object.entries(hashes).map(([algo, hash]) => (
              <Card key={algo} className="shadow-sm">
                 <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-shrink-0 w-24">
                      <span className="font-semibold text-sm">{algo}</span>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                      <code className="text-sm text-secondary-text break-all">
                        {hash || <span className="text-muted-foreground/50">Waiting for input...</span>}
                      </code>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(hash)} disabled={!hash}>
                      <Copy className="w-4 h-4 mr-2" /> Copy
                    </Button>
                 </CardContent>
              </Card>
            ))}
         </div>

         <div className="bg-muted p-4 rounded-lg text-sm text-secondary-text">
            <p className="flex items-center gap-2"><Hash className="w-4 h-4" /> Hashes are generated locally in your browser using the Web Crypto API.</p>
         </div>

      </div>
    </ToolLayout>
  );
}
