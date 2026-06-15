/**
 * Galerie-Aufbewahrung nach dem Event, pro Plan. Nach Ablauf werden die
 * Event-Fotos automatisch gelöscht (DB-Datensätze + Storage-Objekte).
 * Basic 7 Tage, Premium 30 Tage, Enterprise 90 Tage.
 */
export const GALLERY_RETENTION_DAYS: Record<string, number> = {
  BASIC: 7,
  PREMIUM: 30,
  ENTERPRISE: 90,
}

export const GALLERY_RETENTION_LABEL: Record<string, string> = {
  BASIC: '7 Tage',
  PREMIUM: '30 Tage',
  ENTERPRISE: '90 Tage',
}

/**
 * Zeitpunkt, ab dem die Fotos eines Events automatisch gelöscht werden.
 * Gerechnet ab dem Event-Datum (oder, falls fehlend, ab Erstellung).
 */
export function computeGalleryDeleteAt(
  plan: string,
  eventDate?: Date | null,
  createdAt: Date = new Date(),
): Date {
  const days = GALLERY_RETENTION_DAYS[plan] ?? GALLERY_RETENTION_DAYS.BASIC
  const base = eventDate ?? createdAt
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000)
}
