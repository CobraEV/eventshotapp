import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',
          '/register',
          '/register/success',
          '/api/',
          '/dashboard',
          '/dashboard/',
          '/event/*/upload',
          '/event/*/settings',
        ],
      },
    ],
    sitemap: 'https://eventshot.ch/sitemap.xml',
    host: 'https://eventshot.ch',
  }
}
