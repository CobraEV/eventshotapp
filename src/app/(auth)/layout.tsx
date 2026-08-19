import type { Metadata } from 'next'

// Nicht-oeffentlicher bzw. ephemerer Bereich: gehoert nicht in den Suchindex.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import { ReactNode, Suspense } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 flex flex-col">
      <Suspense>
        <Header />
      </Suspense>
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  )
}

export default AuthLayout
