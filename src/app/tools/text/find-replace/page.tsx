"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Replace } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const handleProcess = () => {
    if (!text) {
      setProcessedText("");
      return;
    }
    if (!find) {
      setProcessedText(text);
      return;
    }

    try {
      let resultText = "";
      if (useRegex) {
        // Warning: user regex needs error handling
        const flags = matchCase ? "g" : "gi";
        const regex = new RegExp(find, flags);
        resultText = text.replace(regex, replace);
      } else {
        // Plain string replacement
        if (matchCase) {
          resultText = text.split(find).join(replace);
        } else {
           // Case insensitive split & join requires regex
           const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
           const regex = new RegExp(escapeRegExp(find), "gi");
           resultText = text.replace(regex, replace);
        }
      }
      setProcessedText(resultText);
    } catch (e: any) {
      setProcessedText(`Error in Find expression: ${e.message}`);
    }
  };

  const handleCopy = () => {
    if (processedText) {
      navigator.clipboard.writeText(processedText);
    }
  };

  const handleClear = () => {
    setText("");
    setFind("");
    setReplace("");
    setProcessedText("");
  };

  return (
    <ToolLayout
      title="Find and Replace"
      description="Find and replace text efficiently. Supports case-sensitivity and regular expressions."
      category="Text"
    >
      <div className="space-y-6">

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card border border-border p-4 rounded-xl">
           <div className="space-y-2">
             <Label htmlFor="find">Find</Label>
             <Input id="find" placeholder="Text to find..." value={find} onChange={(e) => setFind(e.target.value)} />
           </div>

           <div className="space-y-2">
             <Label htmlFor="replace">Replace with</Label>
             <Input id="replace" placeholder="Replacement text..." value={replace} onChange={(e) => setReplace(e.target.value)} />
           </div>

           <div className="md:col-span-2 flex flex-wrap gap-6 items-center pt-2">
             <div className="flex items-center space-x-2">
               <Switch
                 id="match-case"
                 checked={matchCase}
                 onCheckedChange={setMatchCase}
               />
               <Label htmlFor="match-case" className="cursor-pointer">Match Case</Label>
             </div>

             <div className="flex items-center space-x-2">
               <Switch
                 id="use-regex"
                 checked={useRegex}
                 onCheckedChange={setUseRegex}
               />
               <Label htmlFor="use-regex" className="cursor-pointer">Use Regular Expressions</Label>
             </div>
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
              <label className="text-sm font-semibold text-secondary-text uppercase">Result</label>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!processedText} className="h-8 text-xs text-secondary-text">
                <Copy className="w-3 h-3 mr-1" /> Copy Result
              </Button>
            </div>
            <textarea
              className="w-full h-[300px] p-4 bg-muted/50 border border-border rounded-lg resize-none outline-none font-mono text-sm"
              placeholder="Replaced text will appear here..."
              value={processedText}
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center justify-start gap-4">
           <Button onClick={handleProcess} size="lg" className="w-full sm:w-auto">
             <Replace className="w-4 h-4 mr-2" />
             Replace All
           </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
