"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CharacterAnalyzer() {
  const [text, setText] = useState("");

  const handleClear = () => {
    setText("");
  };

  const stats = useMemo(() => {
    if (!text) return null;

    const chars = text.length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const lines = text.split(/\r?\n/).length;
    const noSpaces = text.replace(/\s+/g, '').length;

    // Alphanumeric counts
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const punctuation = (text.match(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g) || []).length;

    // Character frequency
    const freqMap: Record<string, number> = {};
    for (const char of text) {
       const c = char.toLowerCase();
       if (c.trim() !== '') {
         freqMap[c] = (freqMap[c] || 0) + 1;
       }
    }
    const freqArr = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
       chars, words, lines, noSpaces, letters, digits, punctuation, freqArr
    };
  }, [text]);

  return (
    <ToolLayout
      title="Character & Word Analyzer"
      description="Analyze text to find character counts, word density, and letter frequencies."
      category="Text"
    >
      <div className="space-y-6">

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-secondary-text uppercase">Text Input</label>
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
              <Trash2 className="w-3 h-3 mr-1" /> Clear
            </Button>
          </div>
          <textarea
            className="w-full h-[250px] p-4 bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
            placeholder="Paste your text here to analyze..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {stats && (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
             <Card className="bg-card shadow-sm border border-border">
               <CardContent className="p-4 flex flex-col items-center">
                 <span className="text-sm text-secondary-text">Characters</span>
                 <span className="text-3xl font-bold text-primary mt-1">{stats.chars}</span>
               </CardContent>
             </Card>
             <Card className="bg-card shadow-sm border border-border">
               <CardContent className="p-4 flex flex-col items-center">
                 <span className="text-sm text-secondary-text">Words</span>
                 <span className="text-3xl font-bold text-primary mt-1">{stats.words}</span>
               </CardContent>
             </Card>
             <Card className="bg-card shadow-sm border border-border">
               <CardContent className="p-4 flex flex-col items-center">
                 <span className="text-sm text-secondary-text">Lines</span>
                 <span className="text-3xl font-bold text-primary mt-1">{stats.lines}</span>
               </CardContent>
             </Card>
             <Card className="bg-card shadow-sm border border-border">
               <CardContent className="p-4 flex flex-col items-center">
                 <span className="text-sm text-secondary-text">Without Spaces</span>
                 <span className="text-3xl font-bold text-primary mt-1">{stats.noSpaces}</span>
               </CardContent>
             </Card>
           </div>
        )}

        {stats && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
             <Card className="bg-card shadow-sm border border-border">
               <CardContent className="p-4 space-y-4">
                 <h3 className="text-sm font-semibold text-secondary-text uppercase">Composition</h3>
                 <ul className="space-y-2 text-sm">
                   <li className="flex justify-between border-b border-border pb-1">
                     <span className="text-secondary-text">Letters</span>
                     <span className="font-semibold">{stats.letters}</span>
                   </li>
                   <li className="flex justify-between border-b border-border pb-1">
                     <span className="text-secondary-text">Digits</span>
                     <span className="font-semibold">{stats.digits}</span>
                   </li>
                   <li className="flex justify-between border-b border-border pb-1">
                     <span className="text-secondary-text">Punctuation</span>
                     <span className="font-semibold">{stats.punctuation}</span>
                   </li>
                 </ul>
               </CardContent>
             </Card>

             <Card className="bg-card shadow-sm border border-border">
               <CardContent className="p-4 space-y-4">
                 <h3 className="text-sm font-semibold text-secondary-text uppercase">Top Characters</h3>
                 {stats.freqArr.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {stats.freqArr.map(([char, count]) => (
                        <li key={char} className="flex justify-between border-b border-border pb-1">
<span className="text-secondary-text bg-muted px-2 py-0.5 rounded font-mono">&quot;{char}&quot;</span>
                          <span className="font-semibold">{count}</span>
                        </li>
                      ))}
                    </ul>
                 ) : (
                    <p className="text-sm text-secondary-text italic">No alphanumeric characters found.</p>
                 )}
               </CardContent>
             </Card>
           </div>
        )}
      </div>
    </ToolLayout>
  );
}
