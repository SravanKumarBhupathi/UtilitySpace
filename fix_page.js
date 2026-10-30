const fs = require('fs');
let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');

// Insert the import
if (!pageCode.includes('import { HeroSearch }')) {
    pageCode = pageCode.replace(
        'import { getIcon } from "@/lib/icons";',
        'import { getIcon } from "@/lib/icons";\nimport { HeroSearch } from "@/components/hero-search";'
    );
}

// Remove the old global search div
const oldDivPattern = /<div\s+className="flex items-center space-x-2 border-2 border-primary\/20 rounded-full px-6 py-4 bg-card hover:border-primary\/50 transition-colors cursor-pointer shadow-sm"\s+onClick=\{\(\) => \{\s+window\.dispatchEvent\(new CustomEvent\('open-global-search'\)\);\s+\}\}\s+>\s+<svg[\s\S]*?<\/svg>\s+<span[\s\S]*?<\/span>\s+<kbd[\s\S]*?<\/kbd>\s+<\/div>/;

pageCode = pageCode.replace(oldDivPattern, "<HeroSearch />");

// Fix shortcut buttons to use the internal HeroSearch query instead of global modal?
// Actually, since HeroSearch has internal state, we can't easily dispatch to it from outside without context or a custom event.
// Let's modify the shortcuts to use a specific hero-search event or just use the global search for shortcuts (or link directly to tools).
// The issue states: "Do not trigger a second search interface. The homepage search should be the primary search experience."
// Let's update HeroSearch to listen for 'open-hero-search' and update the buttons.

const heroEventPattern = /window\.dispatchEvent\(new CustomEvent\('open-global-search', \{ detail: \{ query: term \} \}\)\);/g;
pageCode = pageCode.replace(heroEventPattern, "window.dispatchEvent(new CustomEvent('open-hero-search', { detail: { query: term } }));");

fs.writeFileSync('src/app/page.tsx', pageCode);
console.log("Updated src/app/page.tsx");
