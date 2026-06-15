import '@/styles/globals.css'
import 'moment/locale/de'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EventShot – Live-Fotowand & Slideshow für Hochzeiten und Events',
  description:
    'Mit EventShot werden Eventfotos in Echtzeit geteilt. Gäste scannen den QR-Code, laden ein Foto hoch und es erscheint sofort auf dem Bildschirm – perfekt für Hochzeiten, Firmenfeiern und Messen.',
  authors: [
    { name: 'EdelByte', url: 'https://edelbyte.ch' },
    { name: 'Endrit Veliji' },
  ],
  creator: 'Endrit Veliji',
  publisher: 'EdelByte',
  openGraph: {
    title: 'EventShot – Fotos live am Event',
    description:
      'Lade Fotos per QR-Code hoch und zeige sie live auf dem Event-Screen. Für Hochzeiten, Firmenanlässe & Messen – entwickelt von EdelByte 🇨🇭',
    url: 'https://eventshot.ch',
    siteName: 'EventShot',
    locale: 'de_CH',
    type: 'website',
    images: [
      {
        url: 'https://eventshot.ch/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EventShot – Fotos live am Event',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'EventShot – Fotos live am Event',
    description:
      'QR-Code scannen, Foto hochladen, direkt auf der Leinwand sehen – EventShot macht Events interaktiver! Entwickelt von EdelByte.',
    creator: '@edelbyte',
    images: ['https://eventshot.ch/twitter-image.png'],
  },
  metadataBase: new URL('https://eventshot.ch'),
  alternates: {
    canonical: 'https://eventshot.ch',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="scroll-smooth dark" suppressHydrationWarning>
      <body
        className={`${poppins.className} min-h-svh flex flex-col relative antialiased`}
      >
        <main className="flex-1 flex flex-col">{children}</main>
        <Toaster />
        <Script
          defer
          src="https://umami.edelbyte.ch/script.js"
          data-website-id="81d33849-a760-41dd-9426-f32636c2d3ed"
        />
        {/* Natives <script>: JSON-LD landet so im SSR-HTML (next/script wuerde
            es erst clientseitig injizieren). FAQPage liegt bei der FAQ-Sektion. */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': 'https://edelbyte.ch/#organization',
                name: 'EdelByte',
                url: 'https://edelbyte.ch',
                sameAs: [
                  'https://www.instagram.com/edelbyte.ch/',
                  'https://www.linkedin.com/company/edelbyte',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: 'EventShot',
                description:
                  'Live-Fotowand & Slideshow für Events: Gäste laden Fotos per QR-Code hoch und sehen sie live auf dem Screen. Mit digitaler Galerie, DSG-konform und Schweizer Hosting.',
                url: 'https://eventshot.ch',
                category: 'EventManagementApplication',
                brand: { '@id': 'https://edelbyte.ch/#organization' },
                offers: [
                  {
                    '@type': 'Offer',
                    name: 'Basic',
                    price: '49',
                    priceCurrency: 'CHF',
                    url: 'https://eventshot.ch/#pricing',
                    availability: 'https://schema.org/InStock',
                  },
                  {
                    '@type': 'Offer',
                    name: 'Premium',
                    price: '99',
                    priceCurrency: 'CHF',
                    url: 'https://eventshot.ch/#pricing',
                    availability: 'https://schema.org/InStock',
                  },
                  {
                    '@type': 'Offer',
                    name: 'Enterprise',
                    price: '149',
                    priceCurrency: 'CHF',
                    url: 'https://eventshot.ch/#pricing',
                    availability: 'https://schema.org/InStock',
                  },
                ],
              },
            ]),
          }}
        />
      </body>
    </html>
  )
}
