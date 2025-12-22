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
import { Suspense } from 'react'

export default async function UploadSuccess({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
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
        <CardFooter className="flex justify-center gap-4">
          <Suspense>
            <CardFooterContent params={params} />
          </Suspense>
        </CardFooter>
      </Card>
    </div>
  )
}

const CardFooterContent = async ({
  params,
}: {
  params: Promise<{ eventId: string }>
}) => {
  const { eventId } = await params
  return (
    <>
      <Link href={`/event/${eventId}`}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Startseite
        </Button>
      </Link>
      <Link href={`/event/${eventId}/upload`}>
        <Button variant={'outline'}>
          <Camera className="text-primary" />
          Weiteres hochladen
        </Button>
      </Link>
    </>
  )
}
