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
  title:
    'EventShot – Live-Fotowand & Foto-Slideshow für Hochzeit, Geburtstag & private Feiern',
  description:
    'Die Live-Fotowand & Slideshow für Hochzeit, Geburtstag und private Feiern: Gäste laden Fotos per QR-Code hoch – ganz ohne App – und sehen sie live als elegante Slideshow. Inklusive digitaler Galerie als Erinnerung. DSG-konform, Schweizer Hosting.',
  authors: [
    { name: 'EdelByte', url: 'https://edelbyte.ch' },
    { name: 'Endrit Veliji' },
  ],
  creator: 'Endrit Veliji',
  publisher: 'EdelByte',
  openGraph: {
    title:
      'EventShot – Live-Fotowand & Slideshow für Hochzeit, Geburtstag & private Feiern',
    description:
      'Gäste laden Fotos per QR-Code hoch – ganz ohne App – und sehen sie live als elegante Slideshow. Inklusive digitaler Galerie als Erinnerung. Für Hochzeit, Geburtstag & private Feiern. DSG-konform, Schweizer Hosting.',
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
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://edelbyte.ch/#organization',
                  name: 'EdelByte',
                  url: 'https://edelbyte.ch',
                  logo: 'https://eventshot.ch/EdelByte_Logo_Light_Rect.png',
                  sameAs: [
                    'https://www.instagram.com/edelbyte.ch/',
                    'https://www.linkedin.com/company/edelbyte',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+41445002504',
                    email: 'info@edelbyte.ch',
                    contactType: 'sales',
                    areaServed: 'CH',
                    availableLanguage: ['de', 'en'],
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://eventshot.ch/#software',
                  name: 'EventShot',
                  description:
                    'Live-Fotowand & Slideshow für private Feiern wie Hochzeit und Geburtstag: Gäste laden Fotos per QR-Code hoch und sehen sie live als elegante Slideshow. Mit digitaler Galerie als Erinnerung, DSG-konform und Schweizer Hosting.',
                  url: 'https://eventshot.ch',
                  applicationCategory: 'MultimediaApplication',
                  operatingSystem: 'Web',
                  image: 'https://eventshot.ch/og-image.png',
                  screenshot: 'https://eventshot.ch/og-image.png',
                  publisher: { '@id': 'https://edelbyte.ch/#organization' },
                  inLanguage: 'de-CH',
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
                  featureList: [
                    'Live-Fotowand & elegante Slideshow',
                    'QR-Code-Upload ohne App',
                    'Digitale Galerie als Erinnerung',
                    'Eigenes Branding',
                    'Automatische Löschung',
                    'DSG-konform, Schweizer Hosting',
                  ],
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
