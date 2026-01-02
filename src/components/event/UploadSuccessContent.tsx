import { PhotoSaveActions } from '@/components/event/PhotoSaveActions.client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Camera, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default async function UploadSuccessContent({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>
  searchParams: Promise<{ photo?: string }>
}) {
  const { eventId } = await params
  const { photo } = await searchParams

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
          <CardTitle>Upload erfolgreich!</CardTitle>
          <CardDescription>
            Dein Foto wurde erfolgreich hochgeladen
          </CardDescription>
        </CardHeader>

        {photo && (
          <CardFooter className="flex flex-col gap-4">
            <PhotoSaveActions photoId={photo} />
          </CardFooter>
        )}

        <CardFooter className="flex justify-center gap-4">
          <Link href={`/event/${eventId}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Startseite
            </Button>
          </Link>

          <Link href={`/event/${eventId}/upload`}>
            <Button variant="outline">
              <Camera className="text-primary" />
              Weiteres hochladen
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
