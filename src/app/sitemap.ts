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

    // 🎯 Use-Case-Landingpages
    {
      url: `${BASE_URL}/hochzeit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/geburtstag`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/firmenanlass`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
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
