import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EventShot – Fotos live am Event',
    short_name: 'EventShot',
    description:
      'EventShot zeigt Eventfotos live auf dem Bildschirm. Gäste scannen den QR-Code, laden Fotos hoch und sehen sie sofort – perfekt für Hochzeiten, Firmenanlässe & Messen.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0b0b',
    theme_color: '#ff6a00',
    lang: 'de-CH',
    categories: ['events', 'photography', 'entertainment'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/eventshot-hero.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/eventshot-hero.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
