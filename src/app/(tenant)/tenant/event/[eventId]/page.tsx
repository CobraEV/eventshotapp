import { getEventPhotos } from '@/actions/get-event-photos'
import InteractiveGallery from '@/components/tenant/event/interactive-gallery'
import QRCodeGenerator from '@/components/tenant/event/qr-code-generator'
import SlideshowSettings from '@/components/tenant/event/slideshow-settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
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
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('/')

  const { eventId } = await params

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  })

  if (!event) redirect('/')

  const photos = await getEventPhotos(eventId)

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">
        Event: <span className="text-primary">{event.name}</span>
      </h1>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="photos">Fotos</TabsTrigger>
          <TabsTrigger value="qrcode">QR-Code</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* ---------------- Fotos ---------------- */}
          <TabsContent value="photos">
            <InteractiveGallery admin photos={photos} eventId={eventId} />
          </TabsContent>

          {/* ---------------- QR ---------------- */}
          <TabsContent value="qrcode" className="max-w-md mx-auto">
            <QRCodeGenerator eventId={eventId} />
          </TabsContent>

          {/* ---------------- Settings ---------------- */}
          <TabsContent value="settings" className="max-w-md mx-auto">
            <SlideshowSettings eventId={eventId} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}
