const fs = require('fs');

let typesContent = fs.readFileSync('src/data/types.ts', 'utf8');

// The type Category needs updating because it currently explicitly types out known categories.
// We need to change it to `string` or union the new categories. It's safer to just set it to string if it's strict.
typesContent = typesContent.replace(
  /export type Category = "[^"]+"(?: \| "[^"]+")*;/g,
  'export type Category = string;'
);

fs.writeFileSync('src/data/types.ts', typesContent);

let clientList = fs.readFileSync('src/app/blog/client-list.tsx', 'utf8');
clientList = clientList.replace(
  'const availableCategories = React.useMemo(() => Array.from(new Set(initialPosts.map(p => p.category))), [initialPosts]);',
  'const availableCategories = React.useMemo(() => Array.from(new Set(initialPosts.map(p => p.category))), [initialPosts]);\n  \n  const filteredPosts = React.useMemo(() => {\n    let filtered = initialPosts;\n    if (selectedCategory) {\n      filtered = filtered.filter(p => p.category === selectedCategory);\n    }\n    if (!query.trim()) return filtered;\n    const lowerQuery = query.toLowerCase();\n    return filtered.filter(post => \n      post.title.toLowerCase().includes(lowerQuery) || \n      post.description.toLowerCase().includes(lowerQuery) ||\n      post.category.toLowerCase().includes(lowerQuery)\n    );\n  }, [query, initialPosts, selectedCategory]);'
);

// We need to wipe the old filteredPosts block to avoid duplicate declaration
clientList = clientList.replace(/const filteredPosts = React\.useMemo\(\(\) => \{[\s\S]*?\}, \[query, initialPosts\]\);/, '');

fs.writeFileSync('src/app/blog/client-list.tsx', clientList);
console.log("Fixed types and missing dependencies");
