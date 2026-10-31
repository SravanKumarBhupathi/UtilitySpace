const fs = require('fs');

let sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');

// Insert logic to fetch blog posts and map them into the sitemap array
if (sitemap.indexOf('import { blogPosts } from "@/data/blog";') === -1) {
    sitemap = 'import { blogPosts } from "@/data/blog";\n' + sitemap;

    const insertionPoint = 'return [';
    const sitemapLogic = `
  const blogUrls = blogPosts.map(post => ({
    url: \`\${baseUrl}\${post.href}\`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...blogUrls,`;

    sitemap = sitemap.replace(insertionPoint, sitemapLogic);
    fs.writeFileSync('src/app/sitemap.ts', sitemap);
    console.log('Sitemap updated with all dynamic blog posts.');
}
