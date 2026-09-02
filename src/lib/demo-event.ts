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
  limit: number
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
  // Zwei gleichzeitige erste Dashboard-Aufrufe koennen theoretisch zwei
  // Demo-Events anlegen. Statt einer Sperre ueber den ganzen Vorgang: immer
  // das aelteste nehmen. Dann zeigt das Dashboard verlaesslich dasselbe
  // Event, statt zwischen zwei Zaehlerstaenden zu springen.
  // `as const`, sonst weitet TypeScript die Literale zu string und Prisma
  // erkennt weder die Sortierrichtung noch das _count-Feld wieder.
  const select = {
    id: true,
    uploadLimit: true,
    // Genauso gezaehlt wie in createUploadUrl — sonst zeigt der Balken eine
    // andere Zahl als die, an der die Grenze tatsaechlich greift.
    _count: { select: { photos: { where: { status: { not: 'failed' } } } } },
  } as const
  const oldest = { createdAt: 'asc' } as const

  try {
    let event = await prisma.event.findFirst({
      where: { tenantId, isDemo: true },
      orderBy: oldest,
      select,
    })

    if (!event) {
      await ensureDemoEvent(tenantId)
      event = await prisma.event.findFirst({
        where: { tenantId, isDemo: true },
        orderBy: oldest,
        select,
      })
    }
    if (!event) return null

    return {
      id: event.id,
      used: event._count.photos,
      // Die gespeicherte Grenze, nicht die Konstante: sonst zeigt die Anzeige
      // 20 an, waehrend die Pruefung gegen einen anderen Wert laeuft, sobald
      // jemand das Feld je von Hand aendert.
      limit: event.uploadLimit ?? DEMO_UPLOAD_LIMIT,
    }
  } catch (error) {
    console.error('[demo-event] konnte nicht geladen werden:', error)
    return null
  }
}
