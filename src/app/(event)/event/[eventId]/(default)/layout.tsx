import type { Metadata } from 'next'

// Nicht-oeffentlicher bzw. ephemerer Bereich: gehoert nicht in den Suchindex.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

import EventHeader from '@/components/event/event-header'

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ eventId: string }>
}) {
  return (
    <div className="flex-1 flex flex-col">
      <EventHeader params={params} />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
