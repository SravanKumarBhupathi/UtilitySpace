import { MetadataRoute } from 'next';
import { guides } from '@/data/guides';
import { blogPosts } from '@/data/blog';
import { toolCategories } from '@/data/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://utilityspace.online';

  const staticCoreRoutes = [
    '',
    '/tools',
    '/calculators',
    '/guides',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
  ];

  const categoryRoutes = toolCategories.map((cat) => `/tools/${cat.name.toLowerCase()}`);

  const toolRoutes = [
    // Image Tools
    '/tools/image/compressor',
    '/tools/image/converter',
    '/tools/image/resizer',
    '/tools/image/cropper',
    '/tools/image/rotate-flip',
    '/tools/image/inspector',
    // Text Tools
    '/tools/text/case-converter',
    '/tools/text/character-analyzer',
    '/tools/text/find-replace',
    '/tools/text/remove-blank-lines',
    '/tools/text/remove-duplicate-lines',
    '/tools/text/remove-spaces',
    '/tools/text/reverse-text',
    '/tools/text/slug-generator',
    '/tools/text/sort-lines',
    '/tools/text/text-compare',
    '/tools/text/word-counter',
    // Developer Tools
    '/tools/developer/base64',
    '/tools/developer/hash-generator',
    '/tools/developer/html-entities',
    '/tools/developer/json-formatter',
    '/tools/developer/jwt-decoder',
    '/tools/developer/regex-tester',
    '/tools/developer/timestamp',
    '/tools/developer/url-encoder',
    '/tools/developer/uuid-generator',
    '/tools/developer/xml-formatter',
    // PDF Tools
    '/tools/pdf/add-page-numbers',
    '/tools/pdf/compressor',
    '/tools/pdf/delete-pages',
    '/tools/pdf/extract-pages',
    '/tools/pdf/merger',
    '/tools/pdf/rotate-pages',
    '/tools/pdf/splitter',
    // Calculators
    '/calculators/age',
    '/calculators/attendance',
    '/calculators/average',
    '/calculators/compound-interest',
    '/calculators/date-difference',
    '/calculators/discount',
    '/calculators/emi',
    '/calculators/exam-percentage',
    '/calculators/gst',
    '/calculators/percentage',
    '/calculators/percentage-change',
    '/calculators/profit-loss',
    '/calculators/simple-interest',
  ];

  const coreSitemapEntries = staticCoreRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const categoryEntries = categoryRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const toolEntries = toolRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const guideEntries = guides.map((guide) => ({
    url: `${baseUrl}${guide.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}${post.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...coreSitemapEntries,
    ...categoryEntries,
    ...toolEntries,
    ...guideEntries,
    ...blogEntries,
  ];
}
