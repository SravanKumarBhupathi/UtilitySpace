"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { countWords, countCharacters, countCharactersNoSpaces, countSentences, countParagraphs } from "./counter";

import { Copy, Trash2 } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const words = countWords(text);
  const characters = countCharacters(text);
  const charactersNoSpaces = countCharactersNoSpaces(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const clear = () => {
    setText("");
  };

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in your text."
      category="Text"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-card border border-border p-2 rounded-t-lg border-b-0">
             <div className="text-sm font-medium text-secondary-text px-2">Text Input</div>
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
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 md:h-96 p-4 border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            placeholder="Type or paste your text here..."
          />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary text-white border-primary">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-heading font-bold">{words}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80 mt-1">Words</span>
              </CardContent>
            </Card>
            <Card className="bg-foreground text-background border-foreground">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-heading font-bold">{characters}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-background/80 mt-1">Characters</span>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              <div className="flex justify-between items-center p-4">
                <span className="text-secondary-text text-sm font-medium">Characters (no spaces)</span>
                <span className="font-semibold text-foreground">{charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-secondary-text text-sm font-medium">Sentences</span>
                <span className="font-semibold text-foreground">{sentences}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-secondary-text text-sm font-medium">Paragraphs</span>
                <span className="font-semibold text-foreground">{paragraphs}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
