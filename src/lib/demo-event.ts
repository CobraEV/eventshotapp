import 'server-only'

import prisma from '@/lib/prisma'

/** Wie viele Fotos in ein Demo-Event passen. */
export const DEMO_UPLOAD_LIMIT = 20

/**
 * Legt fuer einen Kunden ein Demo-Event an, falls er noch keines hat.
 *
 * Warum ueberhaupt: bisher musste jemand erst buchen, um zu sehen, was
 * EventShot tut. Zwischen "Konto angelegt" und "erstes Event" stand eine
 * Bezahlschranke — die Registrierung endete in einer leeren Uebersicht. Mit
 * einem Demo-Event endet sie in etwas, das man sofort ausprobieren kann.
 *
 * Enterprise-Funktionsumfang, damit die Demo zeigt, was das Produkt kann,
 * begrenzt allein ueber uploadLimit. Zwanzig Fotos reichen, um eine Galerie
 * und eine Slideshow gefuellt zu sehen, und sind zu wenig, um damit eine
 * echte Feier zu fahren.
 *
 * Wirft nie. Die Funktion laeuft in der Registrierung; ein Fehler hier darf
 * niemandem das Konto verweigern.
 */
export async function ensureDemoEvent(tenantId: number): Promise<void> {
  try {
    const existing = await prisma.event.findFirst({
      where: { tenantId, isDemo: true },
      select: { id: true },
    })
    if (existing) return

    await prisma.event.create({
      data: {
        name: 'Dein Demo-Event',
        description:
          'Zum Ausprobieren: QR-Code scannen, Foto hochladen, Slideshow öffnen.',
        tenantId,
        plan: 'ENTERPRISE',
        // @db.Date — die Uhrzeit wird ohnehin verworfen.
        date: new Date(),
        isActive: true,
        isDemo: true,
        uploadLimit: DEMO_UPLOAD_LIMIT,
      },
    })
  } catch (error) {
    console.error('[demo-event] konnte nicht angelegt werden:', error)
  }
}

export type DemoEventInfo = {
  id: string
  used: number
}

/**
 * Demo-Event des Kunden samt Verbrauch.
 *
 * Legt es bei Bedarf an: Kunden, die sich vor dieser Aenderung registriert
 * haben, sollen ihre Demo beim naechsten Dashboard-Besuch vorfinden, ohne
 * dass jemand ein Skript ueber die Datenbank laufen lassen muss.
 */
export async function getOrCreateDemoEvent(
  tenantId: number,
): Promise<DemoEventInfo | null> {
  try {
    let event = await prisma.event.findFirst({
      where: { tenantId, isDemo: true },
      select: { id: true, _count: { select: { photos: true } } },
    })

    if (!event) {
      await ensureDemoEvent(tenantId)
      event = await prisma.event.findFirst({
        where: { tenantId, isDemo: true },
        select: { id: true, _count: { select: { photos: true } } },
      })
    }
    if (!event) return null

    return { id: event.id, used: event._count.photos }
  } catch (error) {
    console.error('[demo-event] konnte nicht geladen werden:', error)
    return null
  }
}
