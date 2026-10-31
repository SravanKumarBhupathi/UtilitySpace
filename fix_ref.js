const fs = require('fs');

let heroSearch = fs.readFileSync('src/components/hero-search.tsx', 'utf8');

// The inputRef wasn't declared because we stripped it when rewriting inline search.
// Let's add it back or just use querySelector.
heroSearch = heroSearch.replace(
    "inputRef.current?.focus();",
    "(document.querySelector('input[placeholder=\"Search tools, calculators, and guides...\"]') as HTMLInputElement)?.focus();"
);

fs.writeFileSync('src/components/hero-search.tsx', heroSearch);
console.log("Fixed ref error");
