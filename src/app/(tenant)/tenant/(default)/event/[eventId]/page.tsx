import { getEventPhotos } from '@/actions/get-event-photos'
import InteractiveGallery from '@/components/tenant/event/interactive-gallery'
import QRCodeGenerator from '@/components/tenant/event/qr-code-generator'
import SlideshowSettings from '@/components/tenant/event/slideshow-settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { requireOwnedEventPage } from '@/lib/auth-guard'
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

  // Vorher wurde hier nur geprueft, DASS jemand angemeldet ist — das Event
  // dann per findUnique ohne jeden Tenant-Bezug geladen. Jedes selbst
  // angelegte Gratis-Konto oeffnete damit die Verwaltung einer fremden
  // Feier: Fotos, QR-Code, Slideshow-Einstellungen, und ueber die
  // eingebettete Galerie mit admin={true} auch den Loeschknopf.
  const event = await requireOwnedEventPage(eventId, {
    id: true,
    name: true,
    isActive: true,
  })

  // Fetch photos with presigned URLs
  const photos = await getEventPhotos(eventId)

  return (
    <main className='container mx-auto py-8 px-4 md:px-6'>
      <h1 className='text-2xl font-bold mb-6'>
        Event: <span className='text-primary'>{event.name}</span>
      </h1>

      <Tabs defaultValue='photos' className='w-full'>
        <TabsList className='grid grid-cols-3 w-full'>
          <TabsTrigger value='photos'>Fotos</TabsTrigger>
          <TabsTrigger value='qrcode'>QR-Code</TabsTrigger>
          <TabsTrigger value='settings'>Einstellungen</TabsTrigger>
        </TabsList>

        <div className='mt-6'>
          {/* ---------------- Fotos ---------------- */}
          <TabsContent value='photos'>
            <InteractiveGallery
              admin={true}
              photos={photos}
              eventId={eventId}
            />
          </TabsContent>

          {/* ---------------- QR ---------------- */}
          <TabsContent value='qrcode' className='max-w-md mx-auto'>
            <QRCodeGenerator eventId={eventId} />
          </TabsContent>

          {/* ---------------- Settings ---------------- */}
          <TabsContent value='settings' className='max-w-md mx-auto'>
            <SlideshowSettings eventId={eventId} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}
