const fs = require('fs');

let sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');

// remove duplicate import
if (sitemap.startsWith('import { blogPosts } from "@/data/blog";')) {
    sitemap = sitemap.replace('import { blogPosts } from "@/data/blog";\n', '');
    fs.writeFileSync('src/app/sitemap.ts', sitemap);
    console.log('Fixed sitemap duplicate import.');
}
