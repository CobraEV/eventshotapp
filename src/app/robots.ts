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
          '/forgot-password',
          '/reset-password',
          '/api/',
          // Die App nutzt /tenant – '/dashboard' existiert hier gar nicht.
          '/tenant',
          '/tenant/',
          '/event/*/upload',
        ],
        // Bewusst NICHT gesperrt: /event/<id> und /event/<id>/gallery.
        // Sie tragen ein noindex im HTML – das sieht ein Crawler nur, wenn
        // er die Seite auch abrufen darf.
      },
    ],
    sitemap: 'https://eventshot.ch/sitemap.xml',
    host: 'https://eventshot.ch',
  }
}
