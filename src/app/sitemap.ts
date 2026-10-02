import { MetadataRoute } from 'next'
import { guides } from '@/data/guides'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://utilityspace.online'

  const staticRoutes = [
    '',
    '/tools',
    '/calculators',
    '/guides',
    '/knowledge',
    '/blog',
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
    '/tools/developer/base64',
    '/tools/developer/json-formatter',
    '/tools/developer/timestamp',
    '/tools/developer/url-encoder',
    '/tools/developer/uuid-generator',
    '/tools/pdf/merger',
    '/tools/pdf/splitter',
    '/tools/pdf/compressor',
    // Calculators
    '/calculators/age',
    '/calculators/average',
    '/calculators/discount',
    '/calculators/emi',
    '/calculators/gst',
    '/calculators/percentage',
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

  return [...sitemapRoutes, ...guideRoutes]
}
