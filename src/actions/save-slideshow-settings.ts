'use server'

import { requireOwnedEventAction } from '@/lib/auth-guard'
import prisma from '@/lib/prisma'

/** Die Grenzen des Sliders — hier nochmal, weil das UI nicht der Waechter ist. */
const MIN_INTERVAL_MS = 3_000
const MAX_INTERVAL_MS = 15_000

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

  // Ohne diese Pruefung konnte ein Fremder mit der oeffentlichen eventId das
  // Branding einer fremden Hochzeit setzen: brandLogoUrl zeigt auf ein
  // beliebiges Bild im Netz und laeuft in voller Groesse auf deren Beamer.
  const guard = await requireOwnedEventAction(eventId, { plan: true })
  if (!guard.ok) {
    return { success: false as const, message: guard.message }
  }

  // Wasserzeichen und eigenes Branding sind Enterprise-Funktionen. Bisher
  // stand diese Pruefung nur im UI (slideshow-settings.tsx blendet die Felder
  // aus) — die Action nahm die Werte von jedem entgegen.
  const enterprise = guard.event.plan === 'ENTERPRISE'

  // Auch die Zeitgrenze stand nur im Slider. Eine Anzeigedauer von 0 haette
  // die Slideshow durchrasen lassen.
  const interval = Math.min(
    Math.max(Math.round(intervalMs), MIN_INTERVAL_MS),
    MAX_INTERVAL_MS,
  )

  const data = {
    intervalMs: interval,
    showControls,
    hideWatermark: enterprise ? hideWatermark : false,
    brandLogoUrl: enterprise ? brandLogoUrl : null,
  }

  await prisma.eventSlideshowSettings.upsert({
    where: { eventId },
    update: data,
    create: { eventId, ...data },
  })

  return { success: true as const }
}
