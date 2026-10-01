"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import commandScore from "command-score";
import { tools, calculators, guides, knowledge, blogPosts } from "@/data";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "Tools" | "Calculators" | "Guides" | "Knowledge" | "Blog";
  score: number;
};

const allItems: Omit<SearchResult, "score">[] = [
  ...tools.map(t => ({ ...t, type: "Tools" as const })),
  ...calculators.map(t => ({ ...t, type: "Calculators" as const })),
  ...guides.map(t => ({ ...t, type: "Guides" as const })),
  ...knowledge.map(t => ({ ...t, type: "Knowledge" as const })),
  ...blogPosts.map(t => ({ ...t, type: "Blog" as const })),
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Listen for custom event from homepage
    const handleOpenSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(true);
      if (customEvent.detail?.query) {
        setQuery(customEvent.detail.query);
      }
    };
    window.addEventListener("open-global-search", handleOpenSearch);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-global-search", handleOpenSearch);
    };
  }, []);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const searchResults = React.useMemo(() => {
    if (!query) return [];

    const results = allItems
      .map(item => ({
        ...item,
        score: commandScore(item.title, query)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return results;
  }, [query]);

  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 text-secondary-text hover:text-foreground md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      <div
        className="hidden md:flex items-center space-x-2 border border-border rounded-md px-3 py-1.5 cursor-text bg-background hover:bg-muted/50 transition-colors max-w-[240px] w-full"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 text-secondary-text" />
        <span className="text-sm text-secondary-text flex-1 truncate text-left">Search...</span>
        <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-secondary-text opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-x-0 top-0 sm:top-[10%] sm:mx-auto sm:max-w-2xl sm:rounded-xl bg-card border border-border shadow-lg flex flex-col max-h-[100dvh] sm:max-h-[80vh]" ref={modalRef}>
            <div className="flex items-center p-4 border-b border-border gap-2">
              <Search className="h-5 w-5 text-secondary-text shrink-0" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need help with?"
                className="border-0 shadow-none focus-visible:ring-0 text-base h-auto py-2 bg-transparent"
              />
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="shrink-0 h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {!query ? (
                 <div className="p-4">
                   <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-3">Popular Searches</p>
                   <div className="flex flex-wrap gap-2">
                     {["PDF to Word", "Compress PDF", "JPG to PDF", "Percentage", "Age Calculator"].map(term => (
                       <button
                         key={term}
                         onClick={() => setQuery(term)}
                         className="text-sm px-3 py-1.5 rounded-md bg-muted text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                       >
                         {term}
                       </button>
                     ))}
                   </div>
                 </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-sm text-secondary-text">
                  No results found for &quot;{query}&quot;
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {Object.entries(groupedResults).map(([type, items]) => (
                    <div key={type}>
                      <h4 className="text-xs font-semibold text-secondary-text uppercase tracking-wider px-2 mb-2">
                        {type}
                      </h4>
                      <div className="flex flex-col space-y-1">
                        {items.map(item => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
