import { Suspense } from 'react'
import { requireOwnedEventPage } from '@/lib/auth-guard'
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

  // Eigentuemerpruefung, und zwar zwingend: seit der publicCode der
  // Schluessel zum SSE-Stream ist, gibt diese Seite ihn an den Client weiter.
  // Ohne Pruefung holte sich jeder mit einem Konto — oder mit einem selbst
  // gesetzten Cookie, denn der Proxy liest den Cookie nur als Zeichenkette —
  // den Code einer fremden Feier und belegte damit deren einzigen
  // Beamer-Platz. Der Stream selbst bleibt sessionfrei, damit die Leinwand
  // die Nacht durchlaeuft.
  const event = await requireOwnedEventPage(eventId, { publicCode: true })

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