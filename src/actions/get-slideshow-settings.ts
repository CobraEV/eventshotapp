'use server'

import prisma from '@/lib/prisma'

export async function getSlideshowSettings(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      plan: true,
      slideshow: true,
    },
  })

  if (!event) throw new Error('Event not found')

  return {
    intervalMs: event.slideshow?.intervalMs ?? 5000,
    showControls: event.slideshow?.showControls ?? true,

    // Enterprise only
    hideWatermark: event.slideshow?.hideWatermark ?? false,
    brandLogoUrl: event.slideshow?.brandLogoUrl ?? null,

    plan: event.plan,
  }
}
