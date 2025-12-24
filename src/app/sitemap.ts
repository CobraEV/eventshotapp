import type { MetadataRoute } from 'next'

const BASE_URL = 'https://eventshot.ch'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    // 🏠 Landing
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },

    // 📄 Öffentliche Informationsseiten
    {
      url: `${BASE_URL}/agb`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/impressum`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
