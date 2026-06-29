import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata: Metadata = {
  title:
    'EventShot – Live-Fotowand & Foto-Slideshow für Hochzeit, Geburtstag & private Feiern',
  description:
    'Die Live-Fotowand & Slideshow für Hochzeit, Geburtstag und private Feiern: Gäste laden Fotos per QR-Code hoch – ganz ohne App – und sehen sie live als elegante Slideshow. Inklusive digitaler Galerie als Erinnerung. DSG-konform, Schweizer Hosting.',
  authors: [{ name: 'Endrit Veliji', url: 'https://www.eventshot.ch' }],
  creator: 'Endrit Veliji',
  openGraph: {
    title: 'EventShot – Live-Fotowand & Slideshow für private Feiern',
    description:
      'Fotos deiner Gäste – live als elegante Slideshow auf dem Screen. Perfekt für Hochzeit, Geburtstag & private Feiern. Mit digitaler Galerie als Erinnerung.',
    url: 'https://eventshot.ch',
    siteName: 'EventShot',
    images: [
      {
        url: 'https://eventshot.ch/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EventShot – Live-Fotowand & Slideshow für private Feiern',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EventShot – Live-Fotowand & Slideshow für private Feiern',
    description:
      'Fotos deiner Gäste live als Slideshow auf dem Screen – für Hochzeit, Geburtstag & private Feiern. Mit QR-Code hochladen, ganz ohne App.',
    images: ['https://eventshot.ch/og-image.png'],
  },
}

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex-1 flex flex-col'>
      <SmoothScroll />
      <div className='h-16'>
        <Header />
      </div>
      <div className='flex-1 flex flex-col'>{children}</div>
      <Footer />
    </div>
  )
}

export default DefaultLayout
