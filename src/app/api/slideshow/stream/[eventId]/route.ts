import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

const HEARTBEAT_INTERVAL = 20_000
const SESSION_TIMEOUT = 30_000

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params

  const clientId = req.nextUrl.searchParams.get('clientId')
  if (!clientId) {
    return new Response('Missing clientId', { status: 400 })
  }

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
    event.plan === 'ENTERPRISE'
      ? Number.MAX_SAFE_INTEGER
      : event.plan === 'PREMIUM'
        ? 3
        : 1

  const activeWindow = new Date(Date.now() - SESSION_TIMEOUT)

  /* ----------------------------------
     Atomic Session Handling
  ---------------------------------- */
  let sessionId: string

  try {
    const session = await prisma.$transaction(async (tx) => {
      // 🔁 remove old session from same client (reload safe)
      await tx.slideshowSession.deleteMany({
        where: { eventId, clientId },
      })

      const activeScreens = await tx.slideshowSession.count({
        where: {
          eventId,
          lastPing: { gt: activeWindow },
        },
      })

      if (activeScreens >= SCREEN_LIMIT) {
        throw new Error('SCREEN_LIMIT')
      }

      return tx.slideshowSession.create({
        data: {
          eventId,
          clientId,
          plan: event.plan,
          lastPing: new Date(),
        },
      })
    })

    sessionId = session.id
  } catch (err) {
    if ((err as Error).message === 'SCREEN_LIMIT') {
      return new Response('Screen limit reached', { status: 403 })
    }
    throw err
  }

  /* ----------------------------------
     SSE Stream
  ---------------------------------- */
  const stream = new ReadableStream({
    async start(controller) {
      let lastUpdate = new Date(0)
      let alive = true
      let closed = false

      const send = (data: any) => {
        if (closed) return
        try {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
        } catch {
          closed = true
        }
      }

      /* ---------- Heartbeat ---------- */
      const heartbeat = setInterval(async () => {
        if (!alive) return

        await prisma.slideshowSession.updateMany({
          where: { id: sessionId },
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
        console.error('[SSE] stream error', err)
      } finally {
        closed = true
        alive = false
        clearInterval(heartbeat)

        await prisma.slideshowSession
          .deleteMany({ where: { id: sessionId } })
          .catch(() => {})
      }
    },

    cancel() {
      prisma.slideshowSession
        .deleteMany({ where: { id: sessionId } })
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
