import { Suspense } from 'react'
import {
  KundenSkeleton,
  KundenUebersicht,
} from '@/components/tenant/kunden-uebersicht'
import { getCustomerOverview } from '@/lib/admin-data'
import { requireAdminPage } from '@/lib/auth-guard'

export const metadata = {
  title: 'Kunden',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <div className="flex-1 bg-linear-to-br from-background via-muted/20 to-background">
      <div className="container space-y-10 py-10">
        {/* Auch die Ueberschrift steht hinter der Pruefung. Bei Partial
            Prerendering wird die statische Huelle sofort mit 200 ausgeliefert
            und erst der dynamische Teil leitet um — stuende der Titel oben,
            saehe jeder mit irgendeinem Cookie "Kunden · Nur fuer den
            Betreiber" aufblitzen und wuesste, dass es die Seite gibt. */}
        <Suspense fallback={<Kopf skeleton />}>
          <Inhalt />
        </Suspense>
      </div>
    </div>
  )
}

async function Inhalt() {
  // Die Pruefung steht vor der Abfrage, nicht danach: sonst laegen die Daten
  // aller Kunden schon im Speicher, wenn jemand Unbefugtes hier landet.
  await requireAdminPage()
  const daten = await getCustomerOverview()

  return (
    <>
      <Kopf />
      <KundenUebersicht daten={daten} />
    </>
  )
}

function Kopf({ skeleton }: { skeleton?: boolean }) {
  if (skeleton) {
    return (
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="h-3 w-40 animate-pulse rounded bg-muted/40" />
          <div className="h-10 w-48 animate-pulse rounded bg-muted/40" />
        </div>
        <KundenSkeleton />
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Nur für den Betreiber
      </p>
      <h1 className="mt-1 text-4xl font-bold">Kunden</h1>
      <p className="text-muted-foreground">
        Alle registrierten Kunden, ihre Events und was davon bezahlt wurde
      </p>
    </div>
  )
}
