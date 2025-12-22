import EventSlideshow from '@/components/event/event-slideshow'
import { Suspense } from 'react'

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

const SlideShow = async ({
  params,
}: {
  params: Promise<{ eventId: string }>
}) => {
  const { eventId } = await params
  return <EventSlideshow eventId={eventId} fullscreen />
}
