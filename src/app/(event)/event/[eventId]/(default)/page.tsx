import { StepsSection } from '@/components/eventshot/steps-section'
import { Button } from '@/components/ui/button'
import { steps } from '@/lib/tentant/steps'
import { CameraIcon, ImagesIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        {/* ---------------------------------
         * Hero Section
         * --------------------------------- */}
        <div className="py-20 px-4 md:px-6 max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Teile deine Momente
          </h1>

          <p className="text-xl text-muted-foreground">
            Lade dein Foto hoch und erlebe es live auf der Event-Wand.
          </p>

          <Suspense>
            <PageContent params={params} />
          </Suspense>
        </div>

        {/* ---------------------------------
         * Steps Section
         * --------------------------------- */}
        <StepsSection steps={steps} />
      </div>
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
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link href={`/event/${eventId}/upload`}>
        <Button size="lg" className="w-full sm:w-auto">
          <CameraIcon className="mr-2 h-5 w-5" />
          Foto aufnehmen
        </Button>
      </Link>

      <Link href={`/event/${eventId}/gallery`}>
        <Button size="lg" variant="outline" className="w-full sm:w-auto">
          <ImagesIcon className="mr-2 h-5 w-5" />
          Galerie ansehen
        </Button>
      </Link>
    </div>
  )
}
