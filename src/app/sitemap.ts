import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://utilityspace.online'

  const routes = [
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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
