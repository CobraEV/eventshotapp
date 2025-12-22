import PhotoUploadPresigned from '@/components/event/photo-upload-presigned'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6">
      <div className="text-center max-w-md space-y-2">
        <h1 className="text-3xl font-semibold">
          Lade dein <span className="text-primary">Foto</span> hoch
        </h1>
        <p className="text-sm text-muted-foreground">
          Dein Foto erscheint live auf der Eventwall.
        </p>
      </div>
      <Suspense>
        <PageContent params={params} />
      </Suspense>
    </div>
  )
}

const PageContent = async ({
  params,
}: {
  params: Promise<{ eventId: string }>
}) => {
  const { eventId } = await params
  return (
    <>
      <PhotoUploadPresigned eventId={eventId} />
      <Link href={`/event/${eventId}`}>
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Button>
      </Link>
    </>
  )
}
