import 'server-only'

import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'
import type { Prisma } from '@/generated/prisma/client'
import { isAdminEmail } from '@/lib/admin'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * Die einzige Stelle, die eine Session zu einem Tenant aufloest.
 *
 * Vorher machte das jede Seite selbst — und zwar mit drei verschiedenen
 * Fehlerverhalten: zweimal redirect('/login'), einmal ein stilles return null,
 * einmal redirect('/') auf die Marketing-Startseite. Wo jede Stelle ihre
 * eigene Pruefung schreibt, vergisst eine sie irgendwann ganz; genau das war
 * hier passiert.
 *
 * Aufgeloest wird ueber Tenant.email und nicht ueber User.tenantId: das Feld
 * ist im Schema optional und in der Praxis nicht durchgaengig gefuellt. Ein
 * Wechsel darauf wuerde Kunden aussperren.
 */
export type CurrentTenant = { id: number; email: string; name: string }

/** Abgelehnt — als Wert, nie als Ausnahme. Begruendung bei requireTenantAction. */
export type Denied = {
  ok: false
  error: 'UNAUTHENTICATED' | 'FORBIDDEN'
  message: string
}

/**
 * cache() dedupliziert innerhalb EINES Requests. Ohne das fragt allein
 * /tenant/events zweimal Session und Tenant ab (EventsList und CreateButton),
 * und mit rund zwanzig neuen Waechtern vervielfacht sich die Last genau dann,
 * wenn ein Event laeuft.
 */
export const getSessionEmail = cache(async (): Promise<string | null> => {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.email ?? null
})

/**
 * Ist der Anfragende Betreiber? Stuetzt sich auf getSessionEmail, das in
 * cache() steckt — die Frage taucht auf einer Seite mehrfach auf
 * (Navigation, Kopfzeile, Datenabfrage) und kostet trotzdem nur eine
 * Sitzungsabfrage.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  return isAdminEmail(await getSessionEmail())
}

export const getCurrentTenant = cache(
  async (): Promise<CurrentTenant | null> => {
    const email = await getSessionEmail()
    if (!email) return null
    return prisma.tenant.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    })
  },
)

// ---------------------------------------------------------------------------
// Fuer Seiten (Server Components): umleiten statt zurueckgeben
// ---------------------------------------------------------------------------

/**
 * Angemeldet und mit Kundendatensatz — sonst Umleitung.
 *
 * Die beiden Faelle muessen getrennt bleiben: addTenant legt User und Tenant
 * nacheinander und ohne Transaktion an. Scheitert der zweite Schritt, gibt es
 * eine Session ohne Tenant. Ein pauschales redirect('/login') schickte diesen
 * Kunden im Kreis — angemeldet ist er ja, also kaeme er sofort auf /tenant
 * zurueck und von dort wieder auf /login.
 */
export async function requireTenantPage(): Promise<CurrentTenant> {
  const email = await getSessionEmail()
  if (!email) redirect('/login')
  const tenant = await getCurrentTenant()
  if (!tenant) notFound()
  return tenant
}

/**
 * Laedt ein Event nur dann, wenn es dem angemeldeten Kunden gehoert.
 *
 * Die tenantId gehoert in die WHERE-Klausel und nicht in ein if danach: sonst
 * liegen die fremden Daten schon im Speicher und die naechste Aenderung
 * vergisst die Pruefung. notFound() statt einer 403 — eine 403 wuerde
 * verraten, dass es die eventId gibt.
 */
export async function requireOwnedEventPage<S extends Prisma.EventSelect>(
  eventId: string,
  select: S,
): Promise<Prisma.EventGetPayload<{ select: S }>> {
  const email = await getSessionEmail()
  if (!email) redirect('/login')

  // Der Betreiber sieht jedes Event. Das ist keine Aufweichung der Pruefung,
  // sondern ihre bewusste Ausnahme: er muss einem Kunden am Telefon helfen
  // koennen, ohne sich dessen Zugangsdaten geben zu lassen.
  const where: Prisma.EventWhereInput = { id: eventId }
  if (!isAdminEmail(email)) {
    const tenant = await getCurrentTenant()
    if (!tenant) notFound()
    where.tenantId = tenant.id
  }

  const event = await prisma.event.findFirst({ where, select })
  if (!event) notFound()
  return event as Prisma.EventGetPayload<{ select: S }>
}

// ---------------------------------------------------------------------------
// Fuer Server Actions: Wert zurueck, keine Ausnahme
// ---------------------------------------------------------------------------

/**
 * Warum kein throw: Next.js schwaerzt in Produktion die Meldung geworfener
 * Fehler ("An error occurred in the Server Components render"). Der Kunde
 * saehe also nie, dass er sich anmelden soll. Dieselbe Erfahrung steht schon
 * in create-upload-url.ts.
 */
export async function requireTenantAction(): Promise<
  { ok: true; tenant: CurrentTenant } | Denied
> {
  const tenant = await getCurrentTenant()
  if (!tenant) {
    return {
      ok: false,
      error: 'UNAUTHENTICATED',
      message: 'Bitte melde dich an.',
    }
  }
  return { ok: true, tenant }
}

export async function requireOwnedEventAction<S extends Prisma.EventSelect>(
  eventId: string,
  select: S,
): Promise<
  | {
      ok: true
      /** null nur beim Betreiber ohne eigenen Kundendatensatz. */
      tenant: CurrentTenant | null
      event: Prisma.EventGetPayload<{ select: S }>
    }
  | Denied
> {
  const email = await getSessionEmail()
  if (!email) {
    return {
      ok: false,
      error: 'UNAUTHENTICATED',
      message: 'Bitte melde dich an.',
    }
  }

  const admin = isAdminEmail(email)
  const tenant = await getCurrentTenant()

  // Der Betreiber braucht keinen eigenen Tenant, um zu helfen; jeder andere
  // schon.
  if (!tenant && !admin) {
    return {
      ok: false,
      error: 'UNAUTHENTICATED',
      message: 'Bitte melde dich an.',
    }
  }

  // findFirst statt findUnique: id + tenantId sind zusammen kein unique index.
  const event = await prisma.event.findFirst({
    where: admin ? { id: eventId } : { id: eventId, tenantId: tenant?.id },
    select,
  })
  if (!event) {
    return {
      ok: false,
      error: 'FORBIDDEN',
      message: 'Dieses Event gehört nicht zu deinem Konto.',
    }
  }
  // Bewusst null statt eines erfundenen Tenants mit id 0: ein Platzhalter
  // waere still falsch, sobald ihn jemand als Fremdschluessel benutzt.
  return {
    ok: true,
    tenant,
    event: event as Prisma.EventGetPayload<{ select: S }>,
  }
}

/**
 * Nur fuer den Betreiber. Wie requireTenantPage: leitet um statt zu werfen.
 *
 * notFound() und nicht redirect('/'): ein angemeldeter Kunde, der die
 * Kundenuebersicht aufruft, soll nicht erfahren, dass es sie gibt.
 */
export async function requireAdminPage(): Promise<string> {
  const email = await getSessionEmail()
  if (!email) redirect('/login')
  if (!isAdminEmail(email)) notFound()
  return email
}

export async function requireAdminAction(): Promise<
  { ok: true; email: string } | Denied
> {
  const email = await getSessionEmail()
  if (!email) {
    return {
      ok: false,
      error: 'UNAUTHENTICATED',
      message: 'Bitte melde dich an.',
    }
  }
  if (!isAdminEmail(email)) {
    return {
      ok: false,
      error: 'FORBIDDEN',
      message: 'Dieser Bereich ist dem Betreiber vorbehalten.',
    }
  }
  return { ok: true, email }
}

// ---------------------------------------------------------------------------
// Fuer Route Handler
// ---------------------------------------------------------------------------

export async function requireOwnedEventRoute<S extends Prisma.EventSelect>(
  eventId: string,
  select: S,
): Promise<
  | { ok: true; event: Prisma.EventGetPayload<{ select: S }> }
  | { ok: false; response: Response }
> {
  // Einheitlich 404: eine 401 verriete, dass es das Event gibt.
  const denied = { ok: false as const, response: new Response('Not found', { status: 404 }) }
  const tenant = await getCurrentTenant()
  if (!tenant) return denied
  const event = await prisma.event.findFirst({
    where: { id: eventId, tenantId: tenant.id },
    select,
  })
  if (!event) return denied
  return { ok: true, event: event as Prisma.EventGetPayload<{ select: S }> }
}
