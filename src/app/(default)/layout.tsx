import type { ReactNode } from 'react'
import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import SmoothScroll from '@/components/SmoothScroll'

// Bewusst KEINE Metadata hier: Ein Layout mit `title` als String
// verbraucht das `title.template` des Root-Layouts – alle Seiten dieser
// Gruppe verloren dadurch den Marken-Suffix, und die Startseite trug ihn
// doppelt. Titel/Description setzt jede Seite selbst ueber buildMetadata.

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
