import { createEvent } from '@/actions/event'
import { EditEventDialog } from '@/components/tenant/edit-event-dialog'
import { NewEventDialog } from '@/components/tenant/new-event-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { EventWithCount } from '@/types/EventWithCount'
import { Calendar, Camera, Layers3, MapPin } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

/* --------------------------------------------
 * PAGE
 * -------------------------------------------- */

const Page = async () => {
  return (
    <div className="flex-1 bg-linear-to-br from-background via-muted/20 to-background">
      <div className="container py-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Meine Events</h1>
            <p className="text-muted-foreground">
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
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('/login')

  const tenant = await prisma.tenant.findUnique({
    where: { email: session.user.email },
    include: {
      events: {
        select: {
          id: true,
          name: true,
          date: true,
          location: true,
          description: true,
          plan: true,
          isActive: true,
          _count: { select: { photos: true } },
        },
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!tenant) notFound()

  if (tenant.events.length === 0) {
    return <EmptyState tenantId={tenant.id} />
  }

  return (
    <Card className="rounded-3xl border-0 shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers3 className="h-5 w-5 text-primary" />
          Alle Events
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {tenant.events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </CardContent>
    </Card>
  )
}

async function CreateButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) return null

  const tenant = await prisma.tenant.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!tenant) return null

  return (
    <NewEventDialog
      tenantId={tenant.id}
      onCreate={createEvent}
      defaultPlan="PREMIUM"
    />
  )
}

/* --------------------------------------------
 * COMPONENTS
 * -------------------------------------------- */

function EventRow({ event }: { event: EventWithCount }) {
  return (
    <div className="p-6 rounded-2xl border border-border/50 hover:bg-muted/30 transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">{event.name}</h3>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
              {event.plan}
            </span>

            {!event.isActive && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs">
                Inaktiv
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {event.date.toLocaleDateString('de-CH')}
            </span>

            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Camera className="h-4 w-4" />
              {event._count.photos} Fotos
            </span>
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" asChild>
            <Link href={`/tenant/event/${event.id}`}>Einstellungen</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link target="_blank" href={`/event/${event.id}`}>
              Öffnen
            </Link>
          </Button>
          <EditEventDialog event={event} />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ tenantId }: { tenantId: number }) {
  return (
    <Card className="rounded-3xl border-0 shadow-lg">
      <CardContent className="text-center py-20">
        <Layers3 className="h-14 w-14 mx-auto mb-6 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">
          Noch keine Events erstellt
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Erstelle dein erstes Event und beginne Fotos über QR-Codes zu sammeln.
        </p>

        <NewEventDialog
          tenantId={tenantId}
          onCreate={createEvent}
          defaultPlan="PREMIUM"
        />
      </CardContent>
    </Card>
  )
}

function EventsSkeleton() {
  return (
    <Card className="rounded-3xl border-0 shadow-lg">
      <CardContent className="space-y-4 py-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </CardContent>
    </Card>
  )
}
