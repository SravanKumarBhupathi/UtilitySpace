const fs = require('fs');

let heroSearch = fs.readFileSync('src/components/hero-search.tsx', 'utf8');
if (!heroSearch.includes('import Link from "next/link";')) {
    heroSearch = heroSearch.replace('import { useRouter }', 'import Link from "next/link";\nimport { useRouter }');
    fs.writeFileSync('src/components/hero-search.tsx', heroSearch);
}

let aboutPage = fs.readFileSync('src/app/about/page.tsx', 'utf8');
// jsx-a11y/alt-text warning points to an Image component. It's the lucide-react Image icon which doesn't take an alt text, so we'll just ignore it or rename it.
// Oh wait, lucide-react Image might be confused by Next.js if it thinks it's a native img.
// Let's rename the import from lucide-react.
aboutPage = aboutPage.replace('Image,', 'Image as ImageIcon,');
aboutPage = aboutPage.replace('<Image className="w-6 h-6" />', '<ImageIcon className="w-6 h-6" />');
fs.writeFileSync('src/app/about/page.tsx', aboutPage);

console.log("Fixed build errors");
