import { Suspense } from 'react'
import { getSlideshowSettings } from '@/actions/get-slideshow-settings'
import EventSlideshow from '@/components/event/event-slideshow'

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  return (
    <div className='fixed inset-0 bg-black'>
      <Suspense>
        <SlideShow params={params} />
      </Suspense>
    </div>
  )
}

async function SlideShow({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const settings = await getSlideshowSettings(eventId)

  return (
    <EventSlideshow
      eventId={eventId}
      interval={settings.intervalMs}
      controls={settings.showControls}
      hideWatermark={settings.hideWatermark}
      brandLogoUrl={settings.brandLogoUrl}
      fullscreen
    />
  )
}
