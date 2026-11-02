"use client";

export function SearchShortcuts() {
  const terms = [
    "PDF Compressor",
    "Image Compressor",
    "Word Counter",
    "JSON Formatter",
    "Percentage Calculator",
  ];

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {terms.map((term) => (
        <button
          key={term}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("open-hero-search", { detail: { query: term } })
            );
          }}
          className="text-sm px-4 py-2 rounded-full bg-muted border border-border text-secondary-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
        >
          {term}
        </button>
      ))}
    </div>
  );
}
