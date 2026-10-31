const fs = require('fs');
let clientList = fs.readFileSync('src/app/blog/client-list.tsx', 'utf8');

if (!clientList.includes('selectedCategory')) {
    clientList = clientList.replace(
        'const [query, setQuery] = React.useState("");',
        'const [query, setQuery] = React.useState("");\n  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);\n\n  // Extract unique categories from actual posts\n  const availableCategories = React.useMemo(() => Array.from(new Set(initialPosts.map(p => p.category))), [initialPosts]);'
    );

    clientList = clientList.replace(
        'if (!query.trim()) return initialPosts;',
        'let filtered = initialPosts;\n    if (selectedCategory) {\n      filtered = filtered.filter(p => p.category === selectedCategory);\n    }\n    if (!query.trim()) return filtered;'
    );

    clientList = clientList.replace(
        'return initialPosts.filter(post =>',
        'return filtered.filter(post =>'
    );

    const categoryHtml = `
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={\`text-sm px-4 py-2 rounded-full border transition-colors \${!selectedCategory ? 'bg-primary text-white border-primary' : 'bg-card border-border text-secondary-text hover:border-primary/50'}\`}
        >
          All Articles
        </button>
        {availableCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={\`text-sm px-4 py-2 rounded-full border transition-colors \${selectedCategory === cat ? 'bg-primary text-white border-primary' : 'bg-card border-border text-secondary-text hover:border-primary/50'}\`}
          >
            {cat}
          </button>
        ))}
      </div>
    `;

    clientList = clientList.replace(
        '{filteredPosts.length === 0 ? (',
        categoryHtml + '\n      {filteredPosts.length === 0 ? ('
    );

    fs.writeFileSync('src/app/blog/client-list.tsx', clientList);
    console.log("Updated Blog client list with categories.");
}
