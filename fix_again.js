const fs = require('fs');

let clientList = fs.readFileSync('src/app/blog/client-list.tsx', 'utf8');

const filteredPostsCode = `
  const filteredPosts = React.useMemo(() => {
    let filtered = initialPosts;
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (!query.trim()) return filtered;
    const lowerQuery = query.toLowerCase();
    return filtered.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.category.toLowerCase().includes(lowerQuery)
    );
  }, [query, initialPosts, selectedCategory]);
`;

// Insert the missing filteredPosts hook inside the component
clientList = clientList.replace(
  '  // Extract unique categories from actual posts\n  const availableCategories = React.useMemo(() => Array.from(new Set(initialPosts.map(p => p.category))), [initialPosts]);\n  \n  \n\n  return (',
  '  // Extract unique categories from actual posts\n  const availableCategories = React.useMemo(() => Array.from(new Set(initialPosts.map(p => p.category))), [initialPosts]);\n' + filteredPostsCode + '\n  return ('
);

fs.writeFileSync('src/app/blog/client-list.tsx', clientList);
