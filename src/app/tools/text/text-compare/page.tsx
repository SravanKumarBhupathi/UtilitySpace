"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TextCompare() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const handleClear = () => {
    setText1("");
    setText2("");
  };

  const isMatch = () => {
    let t1 = text1;
    let t2 = text2;

    if (!caseSensitive) {
      t1 = t1.toLowerCase();
      t2 = t2.toLowerCase();
    }

    if (ignoreWhitespace) {
      t1 = t1.replace(/\s+/g, '');
      t2 = t2.replace(/\s+/g, '');
    }

    return t1 === t2;
  };

  const match = isMatch();
  const hasInput = text1.length > 0 || text2.length > 0;

  return (
    <ToolLayout
      title="Text Compare"
      description="Check if two pieces of text are identical. Quickly spot differences in strings."
      category="Text"
    >
      <div className="space-y-6">

        {/* Controls */}
        <div className="flex flex-wrap gap-6 bg-card border border-border p-4 rounded-xl items-center">
           <div className="flex items-center space-x-2">
             <Switch
               id="case-sensitive"
               checked={caseSensitive}
               onCheckedChange={setCaseSensitive}
             />
             <Label htmlFor="case-sensitive" className="cursor-pointer">Case Sensitive</Label>
           </div>

           <div className="flex items-center space-x-2">
             <Switch
               id="ignore-whitespace"
               checked={ignoreWhitespace}
               onCheckedChange={setIgnoreWhitespace}
             />
             <Label htmlFor="ignore-whitespace" className="cursor-pointer">Ignore Whitespace & Newlines</Label>
           </div>
        </div>

        {hasInput && (
          <div className={`p-4 rounded-lg border flex items-center justify-center space-x-3 transition-colors ${match ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'}`}>
            {match ? (
               <>
                 <CheckCircle2 className="w-6 h-6" />
                 <span className="font-semibold text-lg">Texts are identical</span>
               </>
            ) : (
               <>
                 <XCircle className="w-6 h-6" />
                 <span className="font-semibold text-lg">Texts are different</span>
               </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Text 1</label>
              <Button variant="ghost" size="sm" onClick={() => setText1("")} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-[300px] p-4 bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
              placeholder="Paste original text here..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Text 2</label>
              <Button variant="ghost" size="sm" onClick={() => setText2("")} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-[300px] p-4 bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
              placeholder="Paste text to compare here..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-start">
           <Button variant="outline" onClick={handleClear} size="sm">
             <Trash2 className="w-4 h-4 mr-2" />
             Clear Both
           </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
