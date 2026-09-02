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

  // Der Plan wird hier durchgesetzt und nicht nur beim Speichern: die Anzeige
  // richtet sich nach diesem Lesepfad. Bis zum 02.09.2026 konnte jeder Fremde
  // ueber die ungeschuetzte Speicher-Action hideWatermark und brandLogoUrl
  // setzen — solange niemand im Dashboard erneut speichert, liefen diese
  // Werte sonst unveraendert weiter auf dem Beamer.
  const enterprise = event.plan === 'ENTERPRISE'

  return {
    intervalMs: event.slideshow?.intervalMs ?? 5000,
    showControls: event.slideshow?.showControls ?? true,

    // Enterprise only
    hideWatermark: enterprise && (event.slideshow?.hideWatermark ?? false),
    brandLogoUrl: enterprise ? (event.slideshow?.brandLogoUrl ?? null) : null,

    plan: event.plan,
  }
}
