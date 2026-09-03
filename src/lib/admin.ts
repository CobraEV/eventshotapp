
/**
 * Betreiber-Zugang.
 *
 * Wer hier steht, sieht alle Events aller Kunden, kann Events kostenlos
 * anlegen und die Kundenuebersicht oeffnen. Standard ist info@edelbyte.ch,
 * per ADMIN_EMAILS (kommagetrennt) erweiterbar — dasselbe Muster wie bei
 * social-wall, damit beide Projekte gleich zu bedienen sind.
 *
 * Bewusst ueber die E-Mail und nicht ueber ein Rollenfeld: eventshot loest
 * Kunden ohnehin ueber Tenant.email auf, und ein zusaetzliches Feld waere
 * eine zweite Wahrheit, die irgendwann auseinanderlaeuft.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'info@edelbyte.ch')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase())
}

// isCurrentUserAdmin() steht bewusst in auth-guard.ts und nicht hier: diese
// Datei darf nichts importieren, was seinerseits sie importiert. Sonst haengt
// die Sichtbarkeitspruefung an der Auswertungsreihenfolge zweier Module.
