import { getEventPhotos } from '@/actions/get-event-photos'
import EventGallery from '@/components/event/event-gallery'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Upload } from 'lucide-react'
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
      <div className="container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Zurück */}
        <div className="flex justify-start">
          <Link href={`/event/${eventId}`}>
            <Button variant="ghost" size="sm" className="gap-2 px-0 sm:px-3">
              <ArrowLeft className="h-4 w-4" />
              <span>Zurück</span>
            </Button>
          </Link>
        </div>

        {/* Aktionen */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Link href={`/event/${eventId}/upload`} className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto gap-2 justify-center">
              <Upload className="h-4 w-4" />
              <span className="sm:inline">Foto hochladen</span>
            </Button>
          </Link>

          <Link
            href={`/api/event/${eventId}/download`}
            className="w-full sm:w-auto"
          >
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto gap-2 justify-center"
            >
              <Download className="h-4 w-4" />
              <span className="sm:inline">Alle Fotos herunterladen</span>
            </Button>
          </Link>
        </div>
      </div>

      <main className="container mx-auto">
        <EventGallery photos={photos} />
      </main>
    </div>
  )
}
