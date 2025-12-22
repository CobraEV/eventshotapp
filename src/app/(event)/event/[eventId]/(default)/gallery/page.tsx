import { getEventPhotos } from '@/actions/get-event-photos'
import EventGallery from '@/components/event/event-gallery'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  return (
    <Suspense>
      <PageContent params={params} />
    </Suspense>
  )
}

const PageContent = async ({
  params,
}: {
  params: Promise<{ eventId: string }>
}) => {
  const { eventId } = await params
  const photos = await getEventPhotos(eventId)
  return (
    <div className="flex-1 flex flex-col gap-6 py-8">
      <div className="container flex justify-between items-center">
        <Link href={`/event/${eventId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        </Link>

        <Link href={`/event/${eventId}/upload`}>
          <Button size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Foto hochladen
          </Button>
        </Link>
      </div>

      <main className="container mx-auto">
        <EventGallery photos={photos} />
      </main>
    </div>
  )
}
