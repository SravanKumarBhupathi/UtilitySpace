import { MetadataRoute } from 'next'
import { guides } from '@/data/guides'
import { blogPosts } from '@/data/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://utilityspace.online'

  const staticRoutes = [
    '',
    '/tools',
    '/calculators',
    '/guides',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    // Tools
    '/tools/image/compressor',
    '/tools/image/converter',
    '/tools/image/resizer',
    '/tools/image/cropper',
    '/tools/text/case-converter',
    '/tools/text/remove-spaces',
    '/tools/text/slug-generator',
    '/tools/text/word-counter',
    '/tools/text/remove-duplicate-lines',
    '/tools/developer/base64',
    '/tools/developer/json-formatter',
    '/tools/developer/timestamp',
    '/tools/developer/url-encoder',
    '/tools/developer/uuid-generator',
    '/tools/developer/jwt-decoder',
    '/tools/text/remove-blank-lines',
    '/tools/text/sort-lines',
    '/tools/pdf/merger',
    '/tools/pdf/splitter',
    '/tools/pdf/extract-pages',
    '/tools/pdf/compressor',
    // Calculators
    '/calculators/age',
    '/calculators/average',
    '/calculators/discount',
    '/calculators/emi',
    '/calculators/gst',
    '/calculators/percentage',
    '/calculators/simple-interest',
    '/calculators/compound-interest',
    '/calculators/date-difference',
    '/tools/image/rotate-flip',
    '/tools/image/inspector',
    '/tools/text/reverse-text',
    '/tools/text/character-analyzer',
    '/tools/text/find-replace',
    '/tools/text/text-compare',
    '/tools/developer/html-entities',
    '/tools/developer/regex-tester',
    '/tools/developer/hash-generator',
    '/tools/developer/xml-formatter',
    '/tools/pdf/rotate-pages',
    '/tools/pdf/delete-pages',
    '/tools/pdf/add-page-numbers',
    '/calculators/percentage-change',
    '/calculators/profit-loss',
    '/calculators/attendance',
    '/calculators/exam-percentage',
  ]

  const sitemapRoutes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}${guide.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}${post.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))



  const blogUrls = blogPosts.map(post => ({
    url: `${baseUrl}${post.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...blogUrls,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },...sitemapRoutes, ...guideRoutes, ...blogRoutes]
}
