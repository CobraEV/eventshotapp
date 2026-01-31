import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

const HEARTBEAT_INTERVAL = 20_000
const SESSION_TIMEOUT = 30_000

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params

  /* ----------------------------------
     Event + Plan
  ---------------------------------- */
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { plan: true },
  })

  if (!event) {
    return new Response('Event not found', { status: 404 })
  }

  const SCREEN_LIMIT =
    event.plan === 'BASIC' ? 1 : event.plan === 'PREMIUM' ? 3 : Infinity

  /* ----------------------------------
     Active screens
  ---------------------------------- */
  const activeWindow = new Date(Date.now() - SESSION_TIMEOUT)

  const activeScreens = await prisma.slideshowSession.count({
    where: {
      eventId,
      lastPing: { gt: activeWindow },
    },
  })

  if (activeScreens >= SCREEN_LIMIT) {
    return new Response('Screen limit reached', { status: 403 })
  }

  /* ----------------------------------
     Create session
  ---------------------------------- */
  const session = await prisma.slideshowSession.create({
    data: {
      eventId,
      plan: event.plan,
      lastPing: new Date(),
    },
  })

  /* ----------------------------------
     SSE Stream
  ---------------------------------- */
  const stream = new ReadableStream({
    async start(controller) {
      let lastUpdate = new Date(0)
      let alive = true

      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
      }

      /* ---------- Heartbeat (SAFE) ---------- */
      const heartbeat = setInterval(async () => {
        if (!alive) return

        await prisma.slideshowSession.updateMany({
          where: { id: session.id },
          data: { lastPing: new Date() },
        })
      }, HEARTBEAT_INTERVAL)

      try {
        while (alive) {
          const evt = await prisma.event.findUnique({
            where: { id: eventId },
            select: { photosUpdatedAt: true },
          })

          if (evt?.photosUpdatedAt && evt.photosUpdatedAt > lastUpdate) {
            lastUpdate = evt.photosUpdatedAt
            send({ type: 'photos-updated' })
          }

          await new Promise((r) => setTimeout(r, 2000))
        }
      } catch (err) {
        console.error('SSE stream error', err)
      } finally {
        alive = false
        clearInterval(heartbeat)

        await prisma.slideshowSession
          .deleteMany({ where: { id: session.id } })
          .catch(() => {})
      }
    },

    cancel() {
      prisma.slideshowSession
        .deleteMany({ where: { id: session.id } })
        .catch(() => {})
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
