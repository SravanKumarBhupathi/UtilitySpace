import { MetadataRoute } from 'next'
import { guides } from '@/data/guides'
import { knowledge } from '@/data/knowledge'
import { blogPosts } from '@/data/blog'
import { EXAM_DATABASE, EXAM_CATEGORIES } from '@/lib/data/exams'


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
    // Exam Tools
    '/exam-tools',
    '/exam-tools/custom',
    // Government Jobs
    '/government-jobs',
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

  const knowledgeRoutes = knowledge.map((item) => ({
    url: `${baseUrl}${item.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}${post.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))


  const examCategoryRoutes = EXAM_CATEGORIES.map((category) => ({
    url: `${baseUrl}/exam-tools/${category.toLowerCase().replace(/\\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const examRoutes = EXAM_DATABASE.filter(exam => exam.active).map((exam) => ({
    url: `${baseUrl}/exam-tools/${exam.category.toLowerCase().replace(/\\s+/g, '-')}/${exam.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...sitemapRoutes, ...guideRoutes, ...knowledgeRoutes, ...blogRoutes, ...examCategoryRoutes, ...examRoutes]
}
