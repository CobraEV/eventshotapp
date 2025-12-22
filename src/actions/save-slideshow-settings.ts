'use server'

import prisma from '@/lib/prisma'

export async function saveSlideshowSettings(params: {
  eventId: string
  intervalMs: number
  showControls: boolean
  hideWatermark?: boolean
  brandLogoUrl?: string | null
}) {
  const {
    eventId,
    intervalMs,
    showControls,
    hideWatermark = false,
    brandLogoUrl = null,
  } = params

  await prisma.eventSlideshowSettings.upsert({
    where: { eventId },
    update: {
      intervalMs,
      showControls,
      hideWatermark,
      brandLogoUrl,
    },
    create: {
      eventId,
      intervalMs,
      showControls,
      hideWatermark,
      brandLogoUrl,
    },
  })

  return { success: true }
}
