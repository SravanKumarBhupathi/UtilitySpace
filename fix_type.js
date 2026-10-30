const fs = require('fs');

let heroSearch = fs.readFileSync('src/components/hero-search.tsx', 'utf8');
heroSearch = heroSearch.replace(
    "document.querySelector('input[placeholder=\"Search tools, calculators, and guides...\"]')?.focus();",
    "(document.querySelector('input[placeholder=\"Search tools, calculators, and guides...\"]') as HTMLInputElement)?.focus();"
);

fs.writeFileSync('src/components/hero-search.tsx', heroSearch);
console.log("Fixed type error");
