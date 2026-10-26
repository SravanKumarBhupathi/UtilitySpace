"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");

  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);

  const { result, error, matches } = useMemo(() => {
    if (!pattern) return { result: null, error: null, matches: [] };

    let flags = "";
    if (flagG) flags += "g";
    if (flagI) flags += "i";
    if (flagM) flags += "m";

    try {
      const regex = new RegExp(pattern, flags);

      if (!text) return { result: null, error: null, matches: [] };

      const matchArray = [];
      let match;

      // If global flag is set, loop. Else single execution.
      if (regex.global) {
         let safeCount = 0;
         while ((match = regex.exec(text)) !== null) {
           matchArray.push({ value: match[0], index: match.index });
           safeCount++;
           if (safeCount > 2000) break; // prevent infinite loops on zero-length matches in some engines
           if (match.index === regex.lastIndex) regex.lastIndex++;
         }
      } else {
         match = regex.exec(text);
         if (match) {
           matchArray.push({ value: match[0], index: match.index });
         }
      }

      return { result: true, error: null, matches: matchArray };
    } catch (e: any) {
      return { result: false, error: e.message, matches: [] };
    }
  }, [pattern, text, flagG, flagI, flagM]);

  const handleClear = () => {
    setPattern("");
    setText("");
  };

  return (
    <ToolLayout
      title="Regular Expression Tester"
      description="Test and debug JavaScript regular expressions directly in your browser."
      category="Developer"
    >
      <div className="space-y-6">

         <div className="space-y-3">
            <Label htmlFor="pattern" className="text-sm font-semibold text-secondary-text uppercase">Regular Expression</Label>
            <div className="flex rounded-lg overflow-hidden border border-border focus-within:ring-2 focus-within:ring-primary/50">
              <div className="bg-muted px-4 flex items-center justify-center text-secondary-text font-mono text-lg border-r border-border">/</div>
              <Input
                id="pattern"
                className="border-0 rounded-none focus-visible:ring-0 font-mono text-base"
                placeholder="^[a-z0-9]+$"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
              <div className="bg-muted px-4 flex items-center justify-center text-secondary-text font-mono text-lg border-l border-border">/</div>
              <div className="bg-muted px-2 flex items-center justify-center text-secondary-text font-mono text-lg">
                {flagG ? 'g' : ''}{flagI ? 'i' : ''}{flagM ? 'm' : ''}
              </div>
            </div>
            {error && (
              <div className="flex items-center text-sm font-medium text-red-500 bg-red-500/10 p-2 rounded-md">
                 <AlertCircle className="w-4 h-4 mr-2" /> {error}
              </div>
            )}
         </div>

         <div className="flex flex-wrap gap-6 bg-card border border-border p-4 rounded-xl items-center">
           <div className="flex items-center space-x-2">
             <Switch id="flag-g" checked={flagG} onCheckedChange={setFlagG} />
             <Label htmlFor="flag-g" className="cursor-pointer font-mono">g (Global)</Label>
           </div>
           <div className="flex items-center space-x-2">
             <Switch id="flag-i" checked={flagI} onCheckedChange={setFlagI} />
             <Label htmlFor="flag-i" className="cursor-pointer font-mono">i (Case Insensitive)</Label>
           </div>
           <div className="flex items-center space-x-2">
             <Switch id="flag-m" checked={flagM} onCheckedChange={setFlagM} />
             <Label htmlFor="flag-m" className="cursor-pointer font-mono">m (Multiline)</Label>
           </div>
        </div>

        <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Test String</label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full h-48 p-4 bg-background border border-border focus:ring-primary/50 rounded-lg resize-none outline-none font-mono text-sm"
              placeholder="Enter text to test your regex against..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
        </div>

        <Card className="shadow-sm">
           <CardHeader className="py-4 border-b border-border bg-muted/20">
             <CardTitle className="text-base text-secondary-text uppercase tracking-wider flex justify-between">
                <span>Match Results</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{matches.length} Matches</span>
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             <div className="max-h-64 overflow-y-auto">
                {matches.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {matches.map((m, i) => (
                      <li key={i} className="p-3 flex justify-between items-start gap-4 hover:bg-muted/50 transition-colors">
                        <span className="font-mono text-sm break-all">{m.value}</span>
                        <span className="text-xs text-secondary-text whitespace-nowrap bg-muted px-2 py-1 rounded">Index: {m.index}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-secondary-text text-sm">
                    {pattern && text && !error ? "No matches found." : "Waiting for valid regex and test string."}
                  </div>
                )}
             </div>
           </CardContent>
        </Card>

      </div>
    </ToolLayout>
  );
}
