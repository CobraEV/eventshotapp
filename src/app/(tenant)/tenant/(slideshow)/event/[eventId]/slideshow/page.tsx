import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import { getSlideshowSettings } from '@/actions/get-slideshow-settings'
import EventSlideshow from '@/components/event/event-slideshow'

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  return (
    <div className="fixed inset-0 bg-black">
      <Suspense>
        <SlideShow params={params} />
      </Suspense>
    </div>
  )
}

async function SlideShow({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params

  // Der publicCode ist der Schluessel fuer den SSE-Stream. Bewusst hier
  // serverseitig geholt statt vom Client geraten.
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { publicCode: true },
  })
  if (!event) notFound()

  const settings = await getSlideshowSettings(eventId)

  return (
    <EventSlideshow
      eventId={eventId}
      publicCode={event.publicCode}
      interval={settings.intervalMs}
      controls={settings.showControls}
      hideWatermark={settings.hideWatermark}
      brandLogoUrl={settings.brandLogoUrl}
      fullscreen
    />
  )
}