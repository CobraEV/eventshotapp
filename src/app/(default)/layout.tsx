import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import SmoothScroll from '@/components/SmoothScroll'
import { Metadata } from 'next'
import { ReactNode, Suspense } from 'react'

export const metadata: Metadata = {
  title: 'EventShot – Dein Event, Deine Fotos',
  description:
    'EventShot macht dein Event unvergesslich. Gäste scannen einen QR-Code, laden Fotos hoch und sehen sie live auf dem Bildschirm. Einfach. Sofort. Interaktiv.',
  keywords: [
    'EventShot',
    'Event Fotos',
    'Foto Upload',
    'Live Slideshow',
    'QR Code Event',
    'Fotoanzeige Hochzeit',
    'Fotos teilen',
    'Gäste Fotos',
    'Event App',
    'Hochzeit Fotowand',
  ],
  authors: [{ name: 'Endrit Veliji', url: 'https://www.eventshot.ch' }],
  creator: 'Endrit Veliji',
  openGraph: {
    title: 'EventShot – Dein Event, Deine Fotos',
    description:
      'Fotos deiner Gäste – live und automatisch auf dem Screen. Perfekt für Hochzeiten, Firmenfeiern & Events.',
    url: 'https://eventshot.ch',
    siteName: 'EventShot',
    images: [
      {
        url: 'https://eventshot.ch/og-image.jpg', // Bild erstellen & ersetzen
        width: 1200,
        height: 630,
        alt: 'EventShot – Dein Event, Deine Fotos',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EventShot – Dein Event, Deine Fotos',
    description:
      'Fotos deiner Gäste direkt auf dem Screen. Mit QR-Code hochladen & teilen – ganz ohne App.',
    images: ['https://eventshot.ch/og-image.jpg'], // gleiches Bild wie oben
  },
}

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 flex flex-col">
      <SmoothScroll />
      <div className="h-[64px]">
        <Header />
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  )
}

export default DefaultLayout
