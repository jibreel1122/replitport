import { MetadataRoute } from 'next'
import { locales } from '@/i18n/locales'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const paths = ['', 'about', 'programs', 'guest-house', 'education-fund', 'contact']
  const entries: MetadataRoute.Sitemap = []
  for (const l of locales) {
    for (const p of paths) {
      entries.push({ url: `${base}/${l}/${p}`, changeFrequency: 'weekly', priority: p ? 0.7 : 1 })
    }
  }
  return entries
}