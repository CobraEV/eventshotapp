import { Layers3 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { NewEventDialog } from '@/components/tenant/new-event-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getKundenForAdmin } from '@/actions/admin-events'
import { AdminNewEventDialog } from '@/components/tenant/admin-new-event-dialog'
import { getVisibleEvents } from '@/lib/admin-data'
import { getCurrentTenant, isCurrentUserAdmin } from '@/lib/auth-guard'
import prisma from '@/lib/prisma'
import { EventRow } from '../page'

/* --------------------------------------------
 * PAGE
 * -------------------------------------------- */

const Page = async () => {
  return (
    <div className='flex-1 bg-linear-to-br from-background via-muted/20 to-background'>
      <div className='container py-10 space-y-10'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-bold'>Meine Events</h1>
            <p className='text-muted-foreground'>
              Übersicht und Verwaltung aller EventShot Events
            </p>
          </div>

          <Suspense>
            <CreateButton />
          </Suspense>
        </div>

        <Suspense fallback={<EventsSkeleton />}>
          <EventsList />
        </Suspense>
      </div>
    </div>
  )
}

export default Page

/* --------------------------------------------
 * DATA
 * -------------------------------------------- */

async function EventsList() {
  const isAdmin = await isCurrentUserAdmin()
  // Der Betreiber sieht hier alles, auch die Demo-Events. Ein Kunde sieht nur
  // seine echten Feiern; sein Demo hat seine eigene Sektion im Dashboard.
  const { events, tenantId } = await getVisibleEvents(isAdmin)

  if (events.length === 0) {
    return tenantId !== null ? <EmptyState tenantId={tenantId} /> : null
  }

  return (
    <Card className='rounded-3xl border-0 shadow-xl bg-card/50 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Layers3 className='h-5 w-5 text-primary' />
          {isAdmin ? `Alle Events aller Kunden (${events.length})` : 'Alle Events'}
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {events.map((event) => (
          <EventRow key={event.id} event={event} showOwner={isAdmin} />
        ))}
      </CardContent>
    </Card>
  )
}

async function CreateButton() {
  // getCurrentTenant statt einer zweiten eigenen Aufloesung: cache() liefert
  // hier das Ergebnis aus EventsList weiter, statt Session und Tenant im
  // selben Request ein zweites Mal abzufragen.
  const isAdmin = await isCurrentUserAdmin()
  const tenant = await getCurrentTenant()
  const kunden = isAdmin ? await getKundenForAdmin() : []

  if (!isAdmin && !tenant) return null

  return (
    <div className='flex flex-wrap gap-2'>
      {isAdmin && <AdminNewEventDialog kunden={kunden} />}
      {tenant && <NewEventDialog tenantId={tenant.id} defaultPlan='PREMIUM' />}
    </div>
  )
}

/* --------------------------------------------
 * COMPONENTS
 * -------------------------------------------- */

function EmptyState({ tenantId }: { tenantId: number }) {
  return (
    <Card className='rounded-3xl border-0 shadow-lg'>
      <CardContent className='text-center py-20'>
        <Layers3 className='h-14 w-14 mx-auto mb-6 text-muted-foreground' />
        <h3 className='text-xl font-semibold mb-2'>
          Noch keine Events erstellt
        </h3>
        <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
          Erstelle dein erstes Event und beginne Fotos über QR-Codes zu sammeln.
        </p>

        <NewEventDialog
          tenantId={tenantId}
          defaultPlan='PREMIUM'
        />
      </CardContent>
    </Card>
  )
}

function EventsSkeleton() {
  return (
    <Card className='rounded-3xl border-0 shadow-lg'>
      <CardContent className='space-y-4 py-10'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i.toString()}
            className='h-24 rounded-xl bg-muted/40 animate-pulse'
          />
        ))}
      </CardContent>
    </Card>
  )
}
