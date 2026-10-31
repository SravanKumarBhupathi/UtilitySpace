
import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import commandScore from "command-score";
import { blogPosts, tools, calculators, guides } from "@/data";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  type: "Tools" | "Calculators" | "Guides" | "Blog";
  score: number;
};

export function HeroSearch() {
  const [query, setQuery] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleOpenHeroSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsFocused(true);
      if (customEvent.detail?.query) {
        setQuery(customEvent.detail.query);
        setTimeout(() => {
            (document.querySelector('input[placeholder="Search tools, calculators, and guides..."]') as HTMLInputElement)?.focus();
        }, 50);
      }
    };
    window.addEventListener("open-hero-search", handleOpenHeroSearch);
    return () => window.removeEventListener("open-hero-search", handleOpenHeroSearch);
  }, []);


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

        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

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

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0 && query.trim().length === 0) return;

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
        setIsFocused(false);
        router.push(selectedItem.href);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full max-w-[680px] mx-auto z-40" ref={containerRef}>
      <div className="relative flex items-center h-14 md:h-[60px] bg-card border-2 border-primary/20 rounded-full hover:border-primary/50 focus-within:border-primary/50 transition-colors shadow-sm overflow-hidden px-2">
        <Search className="h-5 w-5 ml-4 text-secondary-text shrink-0" />
        <input
          type="text"
          className="flex-1 bg-transparent border-0 h-full px-4 text-base md:text-lg text-foreground placeholder:text-secondary-text focus:outline-none focus:ring-0"
          placeholder="Search tools, calculators, and guides..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
        />
        {query.length > 0 && (
          <button
            onClick={() => { setQuery(''); (document.querySelector('input[placeholder="Search tools, calculators, and guides..."]') as HTMLInputElement)?.focus(); }}
            className="p-2 mr-2 text-secondary-text hover:text-foreground hover:bg-muted rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isFocused && query.trim().length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-card border border-border shadow-xl rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto"
        >
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-sm text-secondary-text">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {searchResults.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsFocused(false)}
                    className={`flex flex-col gap-1 px-4 py-3 rounded-lg transition-colors group ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-medium transition-colors ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                        {item.title}
                      </span>
                      {item.category && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                          {item.category}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <span className="text-sm text-secondary-text line-clamp-1">
                        {item.description}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
