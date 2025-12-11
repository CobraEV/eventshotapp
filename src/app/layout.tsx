import '@/styles/globals.css'
import 'moment/locale/de'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EventShot – Fotos live am Event anzeigen',
  description:
    'Mit EventShot werden Eventfotos in Echtzeit geteilt. Gäste scannen den QR-Code, laden ein Foto hoch und es erscheint sofort auf dem Bildschirm – perfekt für Hochzeiten, Firmenfeiern und Messen.',
  keywords: [
    'EventShot',
    'Event Fotos',
    'Live Slideshow',
    'QR Code Foto Upload',
    'Event Display',
    'Hochzeit Fotos live',
    'Event Fotowand',
    'Eventtool Schweiz',
    'EdelByte',
    'Endrit Veliji',
  ],
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
        url: 'https://eventshot.ch/og-image.jpg',
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
    images: ['https://eventshot.ch/og-image.jpg'],
  },
  metadataBase: new URL('https://eventshot.ch'),
  alternates: {
    canonical: 'https://eventshot.ch',
    languages: {
      'de-CH': 'https://eventshot.ch',
      en: 'https://eventshot.ch/en',
    },
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
      </body>
    </html>
  )
}
