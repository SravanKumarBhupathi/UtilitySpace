"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(1);

  const generateUuid = () => {
    return crypto.randomUUID();
  };

  const generate = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUuid());
    }
    setUuids(newUuids);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
  };

  const clear = () => {
    setUuids([]);
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random Universal Unique Identifiers (UUID v4)."
      category="Developer"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <Button onClick={() => { setCount(1); setUuids([generateUuid()]); }} className="w-full sm:w-auto">
              Generate 1
            </Button>
            <div className="flex items-center gap-2 bg-card border border-border rounded-md px-2">
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-16 h-8 text-sm focus:outline-none bg-transparent"
              />
              <Button size="sm" variant="secondary" onClick={generate}>
                Generate Multiple
              </Button>
            </div>
          </div>
          {uuids.length > 0 && (
            <div className="flex gap-2">
               <Button variant="outline" onClick={copyAll}>
                 <Copy className="w-4 h-4 mr-2" /> Copy All
               </Button>
               <Button variant="ghost" className="text-red-500 hover:bg-red-50" onClick={clear}>
                 <Trash2 className="w-4 h-4 mr-2" /> Clear
               </Button>
            </div>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto p-4 space-y-2">
              {uuids.map((uuid, index) => (
                <div key={`${uuid}-${index}`} className="flex items-center justify-between p-3 bg-muted rounded-md group hover:bg-muted/80 transition-colors">
                  <span className="font-mono text-sm tracking-wider">{uuid}</span>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(uuid)} className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
