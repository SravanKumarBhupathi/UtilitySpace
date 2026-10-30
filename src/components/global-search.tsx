"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import commandScore from "command-score";
import { tools, calculators, guides, blogPosts } from "@/data";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  type: "Tools" | "Calculators" | "Guides" | "Blog";
  score: number;
};

export function GlobalSearch() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      setSelectedIndex(0);
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
    if (!query.trim()) return [];

    const normalizedQuery = query.trim().toLowerCase();

    const allItems: Omit<SearchResult, "score">[] = [
      ...tools.map(t => ({ ...t, category: t.category || "Tool", type: "Tools" as const })),
      ...calculators.map(t => ({ ...t, category: t.category || "Calculator", type: "Calculators" as const })),
      ...guides.map(t => ({ ...t, category: t.category || "Guide", type: "Guides" as const })),
      ...blogPosts.map(t => ({ ...t, category: t.category || "Blog", type: "Blog" as const })),
    ];

    const results = allItems
      .map(item => {
        let score = 0;
        const itemTitle = item.title.toLowerCase();

        if (itemTitle === normalizedQuery) {
          score = 100;
        } else if (itemTitle.startsWith(normalizedQuery)) {
          score = 80;
        } else {
          score = commandScore(item.title, normalizedQuery);
        }

        if (score === 0 && item.description) {
           score = commandScore(item.description, normalizedQuery) * 0.5;
        }

        return {
          ...item,
          score
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Display top 8 unique items to avoid clutter

    // Deduplicate
    const seen = new Set();
    const deduplicated = [];
    for (const res of results) {
      if (!seen.has(res.href)) {
        seen.add(res.href);
        deduplicated.push(res);
      }
    }

    return deduplicated;
  }, [query]);

  // Handle keyboard navigation in search results
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedItem = searchResults[selectedIndex];
      if (selectedItem) {
        setIsOpen(false);
        router.push(selectedItem.href);
      }
    }
  };

  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  let globalIndex = 0;

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
                onKeyDown={handleKeyDown}
                placeholder="Search tools, calculators, and guides..."
                className="border-0 shadow-none focus-visible:ring-0 text-base h-auto py-2 bg-transparent"
              />
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="shrink-0 h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {!query.trim() ? (
                 <div className="p-4">
                   <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-3">Popular Searches</p>
                   <div className="flex flex-wrap gap-2">
                     {["PDF Compressor", "Image Compressor", "Word Counter", "JSON Formatter", "Percentage Calculator"].map(term => (
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
                  {Object.entries(groupedResults).map(([type, items]) => {
                    const sectionHtml = (
                      <div key={type}>
                        <h4 className="text-xs font-semibold text-secondary-text uppercase tracking-wider px-2 mb-2">
                          {type}
                        </h4>
                        <div className="flex flex-col space-y-1">
                          {items.map(item => {
                            const isSelected = globalIndex === selectedIndex;
                            globalIndex++;
                            return (
                              <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex flex-col gap-1 px-3 py-3 rounded-md transition-colors group ${isSelected ? "bg-primary/10" : "hover:bg-muted/50"}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm font-medium transition-colors ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                                    {item.title}
                                  </span>
                                  {item.category && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                                      {item.category}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <span className="text-xs text-secondary-text line-clamp-1">
                                    {item.description}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                    return sectionHtml;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
