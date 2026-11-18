"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2 } from "lucide-react";

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "over", "after"
]);

export default function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const [slug, setSlug] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [filterStopWords, setFilterStopWords] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSlug = (text: string, sep: string, removeStops: boolean) => {
    if (!text.trim()) {
      setSlug("");
      return;
    }
    let words = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^\w\s-]/g, "") // remove non-word chars
      .trim()
      .split(/\s+/);

    if (removeStops) {
      const filtered = words.filter((w) => !STOP_WORDS.has(w));
      words = filtered.length > 0 ? filtered : words;
    }

    const result = words.join(sep).replace(new RegExp(`\\${sep}+`, "g"), sep);
    setSlug(result);
  };

  useEffect(() => {
    generateSlug(input, separator, filterStopWords);
  }, [input, separator, filterStopWords]);

  const copyToClipboard = async () => {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const clear = () => {
    setInput("");
    setSlug("");
    setCopied(false);
  };

  const howToSteps = [
    "Enter your article title, blog headline, or phrase into the 'Original Text' field.",
    "Configure your word separator preference: hyphens (standard for SEO URLs: this-is-a-slug) or underscores (this_is_a_slug).",
    "Toggle the stop-word filter if you want to automatically strip common filler words (like 'a', 'the', 'in', 'and') for cleaner URLs.",
    "Click the 'Copy' button to copy your sanitized, URL-friendly slug to your clipboard for instant publishing in your CMS or codebase.",
  ];

  const faqs = [
    {
      question: "What is a URL slug?",
      answer: "A URL slug is the human-readable, hyphenated portion at the end of a web address that identifies a particular post or webpage. For example, in 'https://example.com/blog/best-javascript-frameworks', the slug is 'best-javascript-frameworks'.",
    },
    {
      question: "Why are clean slugs crucial for SEO?",
      answer: "Search engine algorithms like Google use keywords in URLs to gauge topic relevance and index pages accurately. Clean, concise slugs without special characters improve search rankings and drastically enhance user trust and click-through rates (CTR) on Search Engine Result Pages (SERPs) and social media feeds.",
    },
    {
      question: "How are special characters, emojis, and accented letters handled?",
      answer: "Our slug generator employs Unicode Normalization Form D (NFD) to decompose and strip accents (e.g., converting 'café' to 'cafe' or 'mañana' to 'manana'). Emojis, punctuation marks, brackets, and non-alphanumeric characters are automatically removed according to RFC 3986 URI guidelines.",
    },
    {
      question: "Should I use hyphens or underscores for URL slugs?",
      answer: "Google and major search engines officially recommend using hyphens (-) rather than underscores (_) to separate words in URLs. Search engine crawlers treat hyphens as natural word spaces, whereas underscores may be treated as joiners, merging two words into one.",
    },
  ];

  const aboutText = "UtilitySpace Slug Generator is an SEO-friendly URL slug generation tool built for content creators, bloggers, software developers, and marketers. Convert any title or heading into a clean, lowercase, keyword-rich permalink formatted according to web standards in real time.";

  return (
    <ToolLayout
      title="Slug Generator"
      description="Convert any string into a clean, URL-friendly slug instantly."
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

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="space-y-3">
          <Label htmlFor="input" className="text-lg">Original Text</Label>
          <Input
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. This is a Great Title for a Blog Post!"
            className="text-base h-12"
          />
        </div>

        <div className="flex flex-wrap gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="separator"
              checked={separator === "-"}
              onChange={() => setSeparator("-")}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm font-medium">Hyphens (this-is-a-slug)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="separator"
              checked={separator === "_"}
              onChange={() => setSeparator("_")}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm font-medium">Underscores (this_is_a_slug)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterStopWords}
              onChange={(e) => setFilterStopWords(e.target.checked)}
              className="accent-primary w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Remove stop words (a, the, in...)</span>
          </label>

          <Button onClick={clear} variant="ghost" className="text-secondary-text ml-auto" disabled={!input}>Clear</Button>
        </div>

        <div className="p-6 bg-muted/30 rounded-xl border border-border mt-8">
           <div className="flex justify-between items-center mb-3">
             <Label className="text-lg">URL Slug</Label>
           </div>
           <div className="flex gap-2 relative">
             <Input
               value={slug}
               readOnly
               className="font-mono text-primary bg-background h-14 text-lg pr-24"
               placeholder="your-slug-will-appear-here"
             />
             <Button
               variant="default"
               className="absolute right-1 top-1 bottom-1 h-12"
               onClick={copyToClipboard}
               title="Copy slug"
               disabled={!slug}
             >
               {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
               {copied ? "Copied" : "Copy"}
             </Button>
           </div>
        </div>
      </div>
    </ToolLayout>
  );
}
