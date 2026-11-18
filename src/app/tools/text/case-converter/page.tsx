"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, CheckCircle2 } from "lucide-react";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const clear = () => {
    setText("");
    setCopied(false);
  };

  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());
  const toTitleCase = () => {
    setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()));
  };
  const toSentenceCase = () => {
    // Robust sentence case: Capitalize first letter of string and first letter after a terminal punctuation + spaces
    setText(text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (c) => c.toUpperCase()));
  };
  const toAlternatingCase = () => {
    setText(text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''));
  };
  const toInverseCase = () => {
    setText(text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''));
  };
  const toCamelCase = () => {
    setText(text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (match.trim() === "") return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    }));
  };
  const toPascalCase = () => {
    setText(text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
      if (match.trim() === "") return "";
      return match.toUpperCase();
    }));
  };
  const toSnakeCase = () => {
    setText(text.replace(/\W+/g, " ").trim().split(" ").join("_").toLowerCase());
  };
  const toKebabCase = () => {
    setText(text.replace(/\W+/g, " ").trim().split(" ").join("-").toLowerCase());
  };

  const howToSteps = [
    "Paste or type your raw content into the text editor area.",
    "Choose your target casing style by clicking one of the format buttons: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, or kebab-case.",
    "Your text is transformed instantly and displayed in the editor.",
    "Click 'Copy' to copy the formatted text to your clipboard, or click 'Clear' to start fresh.",
  ];

  const faqs = [
    {
      question: "What is the difference between camelCase and PascalCase?",
      answer: "Both camelCase and PascalCase combine multiple words without spaces, capitalizing the first letter of each subsequent word. The key difference is the first character: camelCase begins with a lowercase letter (e.g., 'userName' or 'calculateTotalCost'), widely used for JavaScript and TypeScript variables and functions. PascalCase capitalizes the very first letter (e.g., 'UserName' or 'CalculateTotalCost'), standard for class names, interfaces, and React components.",
    },
    {
      question: "How does Title Case handle small words like articles and prepositions?",
      answer: "Under formal publishing style guides (such as Chicago, APA, and MLA), major words in titles are capitalized while short grammatical words—such as articles ('a', 'an', 'the'), short prepositions ('in', 'on', 'at', 'to', 'for', 'by'), and coordinating conjunctions ('and', 'but', 'or')—remain lowercase unless they are the first or last word. Our fast title-casing tool capitalizes word boundaries cleanly for titles, headings, and data normalization.",
    },
    {
      question: "When should I use snake_case vs kebab-case?",
      answer: "snake_case separates words with underscores (e.g., 'order_tracking_number') and is standard in Python, SQL column names, and database schemas. kebab-case separates words with hyphens (e.g., 'order-tracking-number') and is preferred for URL slugs, CSS class names, HTML attributes, and command-line arguments.",
    },
    {
      question: "Is there any limit to the amount of text I can convert?",
      answer: "No. All text conversions are processed locally in your web browser with zero server round-trips. You can convert long blog posts, essays, transcripts, or code snippets instantaneously.",
    },
  ];

  const aboutText = "UtilitySpace Text Case Converter is an intuitive, instant text formatting utility built for writers, editors, software developers, and students. Easily switch between common typographical styles and programming naming conventions in a single click with complete privacy.";

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and more."
      category="Text"
      howToSteps={howToSteps}
      faqs={faqs}
      aboutText={aboutText}
    >
      <div className="text-center mb-6">
        <p className="text-sm text-secondary-text bg-muted/50 inline-block px-3 py-1 rounded-full border border-border">
          🔒 Your text is processed locally in your browser.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={toUpperCase} variant="secondary" disabled={!text}>UPPERCASE</Button>
          <Button onClick={toLowerCase} variant="secondary" disabled={!text}>lowercase</Button>
          <Button onClick={toTitleCase} variant="secondary" disabled={!text}>Title Case</Button>
          <Button onClick={toSentenceCase} variant="secondary" disabled={!text}>Sentence case</Button>
          <Button onClick={toAlternatingCase} variant="secondary" disabled={!text}>aLtErNaTiNg cAsE</Button>
          <Button onClick={toInverseCase} variant="secondary" disabled={!text}>iNVERSE cASE</Button>
          <Button onClick={toCamelCase} variant="secondary" disabled={!text}>camelCase</Button>
          <Button onClick={toPascalCase} variant="secondary" disabled={!text}>PascalCase</Button>
          <Button onClick={toSnakeCase} variant="secondary" disabled={!text}>snake_case</Button>
          <Button onClick={toKebabCase} variant="secondary" disabled={!text}>kebab-case</Button>
        </div>
        <div className="space-y-0 relative">
          <div className="flex justify-between items-center bg-card border border-border p-2 rounded-t-lg border-b-0">
             <div className="text-sm font-medium text-secondary-text px-2">Text Content</div>
             <div className="flex gap-2">
               <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copy text" className="h-8" disabled={!text}>
                 {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-success" /> : <Copy className="w-4 h-4 mr-2" />}
                 {copied ? "Copied" : "Copy"}
               </Button>
               <Button variant="ghost" size="sm" onClick={clear} title="Clear text" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50" disabled={!text}>
                 <Trash2 className="w-4 h-4 mr-2" /> Clear
               </Button>
             </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 md:h-96 p-4 border border-border bg-card rounded-b-lg resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            placeholder="Type or paste your text here to convert..."
            spellCheck="false"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
