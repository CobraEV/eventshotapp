import {
  Calendar,
  Camera,
  Clock,
  Layers3,
  MapPin,
  MonitorPlayIcon,
  SettingsIcon,
  ShareIcon,
  TrendingUp,
} from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createEvent } from '@/actions/event'
import { EditEventDialog } from '@/components/tenant/edit-event-dialog'
import { NewEventDialog } from '@/components/tenant/new-event-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { EventWithCount } from '@/types/EventWithCount'

/* --------------------------------------------
 * PAGE
 * -------------------------------------------- */

export default async function AdminEventsPage() {
  return (
    <div className='flex-1 bg-linear-to-br from-background via-muted/20 to-background'>
      <div className='container py-12 space-y-12'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20'>
            <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
            <span className='text-sm font-medium text-primary'>
              Live Dashboard
            </span>
          </div>

          <h1 className='text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            EventShot Dashboard
          </h1>

          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Verwalte deine Events und verfolge deine Statistiken auf einen Blick
          </p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  )
}

/* --------------------------------------------
 * DATA + LOGIC
 * -------------------------------------------- */

async function DashboardContent() {
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
      },
    },
  })

  if (!tenant) notFound()

  const stats = getDashboardStats(tenant.events)

  const sortedEvents = [...tenant.events].sort((a, b) => {
    if (!a.date || !b.date) return 0
    const now = new Date()

    const aPast = a.date < now
    const bPast = b.date < now

    if (aPast !== bPast) return aPast ? 1 : -1
    return a.date.getTime() - b.date.getTime()
  })

  return (
    <>
      {/* KPI */}
      {stats.totalEvents > 0 && (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            label='Vergangene Events'
            value={stats.past}
            icon={Clock}
            color='blue'
            footer='Abgeschlossen'
          />
          <StatCard
            label='Bevorstehende Events'
            value={stats.upcoming}
            icon={Calendar}
            color='green'
            footer='Geplant'
          />
          <StatCard
            label='Fotos insgesamt'
            value={stats.totalPhotos.toLocaleString()}
            icon={Camera}
            color='purple'
            footer='Hochgeladen'
          />
          <StatCard
            label='Ø Fotos / Event'
            value={stats.avgPhotos}
            icon={TrendingUp}
            color='orange'
            footer='Durchschnitt'
          />
        </div>
      )}

      {/* EVENTS */}
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h2 className='text-3xl font-bold'>Events verwalten</h2>
            <p className='text-muted-foreground'>
              Erstelle und verwalte deine EventShot Events
            </p>
          </div>

          <NewEventDialog
            tenantId={tenant.id}
            onCreate={createEvent}
            defaultPlan='PREMIUM'
          />
        </div>

        <Card className='rounded-3xl border-0 shadow-xl bg-card/50 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='text-xl flex items-center gap-2'>
              <Layers3 className='h-5 w-5 text-primary' />
              Bevorstehende Events
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            {sortedEvents.length === 0 && <EmptyState tenantId={tenant.id} />}

            {sortedEvents.map((ev) => (
              <EventRow key={ev.id} event={ev} />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

/* --------------------------------------------
 * HELPERS
 * -------------------------------------------- */

function getDashboardStats(events: EventWithCount[]) {
  const now = new Date()

  const past = events.filter((e) => e.date && e.date < now).length
  const upcoming = events.filter((e) => e.date && e.date > now).length
  const totalPhotos = events.reduce((s, e) => s + e._count.photos, 0)

  return {
    totalEvents: events.length,
    past,
    upcoming,
    totalPhotos,
    avgPhotos: events.length > 0 ? Math.round(totalPhotos / events.length) : 0,
  }
}

/* --------------------------------------------
 * COMPONENTS
 * -------------------------------------------- */

export function EventRow({ event }: { event: EventWithCount }) {
  return (
    <div className='p-6 rounded-2xl border border-border/50 hover:bg-muted/30 transition'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <h3 className='font-semibold text-lg'>{event.name}</h3>

            <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20'>
              {event.plan}
            </span>
          </div>

          <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
            {event.date && (
              <span className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {event.date.toLocaleDateString('de-DE')}
              </span>
            )}
            {event.location && (
              <span className='flex items-center gap-1'>
                <MapPin className='h-4 w-4' />
                {event.location}
              </span>
            )}
            {event._count.photos > 0 && (
              <span className='flex items-center gap-1'>
                <Camera className='h-4 w-4' />
                {event._count.photos} Fotos
              </span>
            )}
          </div>

          {event.description && (
            <p className='text-sm text-muted-foreground line-clamp-2'>
              {event.description}
            </p>
          )}
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <Button variant={'secondary'} asChild>
            <Link href={`/tenant/event/${event.id}`}>
              <SettingsIcon />
              Einstellungen
            </Link>
          </Button>
          <Button variant={'secondary'} asChild>
            <Link target='_blank' href={`/event/${event.id}`}>
              <ShareIcon />
              Öffnen
            </Link>
          </Button>
          <Button variant={'default'} asChild>
            <Link href={`/tenant/event/${event.id}/slideshow`} target='_blank'>
              <MonitorPlayIcon />
              Slideshow
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
    <div className='text-center py-16'>
      <Layers3 className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
      <h3 className='text-lg font-semibold mb-2'>
        Noch keine Events vorhanden
      </h3>
      <p className='text-muted-foreground mb-6'>
        Erstelle dein erstes Event und starte mit dem Sammeln von Fotos.
      </p>
      <NewEventDialog
        tenantId={tenantId}
        onCreate={createEvent}
        defaultPlan='PREMIUM'
      />
    </div>
  )
}

const STAT_COLORS = {
  blue: {
    icon: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
  },
  green: {
    icon: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500/10',
  },
  purple: {
    icon: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10',
  },
  orange: {
    icon: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10',
  },
} as const

type StatColor = keyof typeof STAT_COLORS

function StatCard({
  label,
  value,
  color = 'blue',
  icon: Icon,
  footer,
}: {
  label: string
  value: number | string
  color?: StatColor
  icon: React.ElementType
  footer: string
}) {
  const styles = STAT_COLORS[color]

  return (
    <Card className='group relative overflow-hidden rounded-3xl border-0 shadow-lg p-8'>
      {/* background tint */}
      <div
        className={`absolute inset-0 ${styles.bg} opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className='relative'>
        <div className='flex justify-between items-center mb-4'>
          <div className={`p-3 rounded-2xl ${styles.bg}`}>
            <Icon className={`h-6 w-6 ${styles.icon}`} />
          </div>
          <span className='text-sm text-muted-foreground'>{label}</span>
        </div>

        <div className='text-4xl font-bold mb-1'>{value}</div>
        <div className='text-sm text-muted-foreground'>{footer}</div>
      </div>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className='space-y-8'>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i.toString()} className='h-40 animate-pulse bg-muted/40' />
        ))}
      </div>
      <Card className='h-96 animate-pulse bg-muted/40' />
    </div>
  )
}
