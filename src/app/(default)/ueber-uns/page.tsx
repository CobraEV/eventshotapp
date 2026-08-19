import { ArrowRight, QrCode, Server, Timer, Wallet } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ui/motion'
import { buildMetadata } from '@/lib/seo/metadata'
import { ORG_ID, SITE, WEBSITE_ID, breadcrumbNode, graph } from '@/lib/seo/schema'

export const metadata: Metadata = buildMetadata({
  path: '/ueber-uns',
  title: 'Über uns – EventShot von EdelByte',
  description:
    'Wer hinter EventShot steht: EdelByte aus Turbenthal, eigene Infrastruktur in der Schweiz und ein Einmalpreis pro Event statt Abo.',
})

const FAKTEN = [
  { label: 'Firma', value: 'EdelByte Veliji' },
  { label: 'Rechtsform', value: 'Einzelunternehmen' },
  { label: 'Inhaber', value: 'Endrit Veliji' },
  { label: 'Sitz', value: 'Zihlackerring 6, 8488 Turbenthal' },
  { label: 'UID', value: 'CHE-365.373.264' },
  { label: 'Kontakt', value: 'info@edelbyte.ch · 044 500 25 04' },
]

const ENTSCHEIDUNGEN = [
  {
    icon: Server,
    title: 'Eigene Infrastruktur in der Schweiz',
    copy: 'Die hochgeladenen Bilder bleiben auf unserer eigenen Infrastruktur in der Schweiz – kein Drittanbieter, keine Weitergabe. Das ist der Grund, warum wir den Betrieb nicht ausgelagert haben.',
  },
  {
    icon: Wallet,
    title: 'Einmalpreis pro Event statt Abo',
    copy: 'Ein Fest ist ein Datum, kein Dauerzustand. Darum kostet EventShot einmalig CHF 49.-, CHF 99.- oder CHF 149.- für den gebuchten Anlass. Die Registrierung ist kostenlos, du zahlst erst beim Buchen.',
  },
  {
    icon: QrCode,
    title: 'Nichts, was Gäste installieren müssen',
    copy: 'Wer den QR-Code scannt, landet direkt im Browser: Foto auswählen, hochladen – fertig. Ohne App und ohne Konto bleibt niemand am Eingang der Technik hängen.',
  },
  {
    icon: Timer,
    title: 'Löschen gehört zum Produkt',
    copy: 'Je nach Paket bleibt die digitale Galerie 7, 30 oder 90 Tage erreichbar. Danach verschwinden die Bilder automatisch von unseren Schweizer Servern, ohne dass du daran denken musst.',
  },
]

const jsonLd = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Über uns', path: '/ueber-uns' },
  ]),
  {
    '@type': 'AboutPage',
    '@id': `${SITE.url}/ueber-uns#aboutpage`,
    url: `${SITE.url}/ueber-uns`,
    name: 'Über uns',
    description:
      'EventShot ist ein Produkt von EdelByte Veliji, einem Einzelunternehmen mit Sitz in Turbenthal. Betrieb auf eigener Infrastruktur in der Schweiz, Einmalpreis pro Event.',
    inLanguage: SITE.locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    mainEntity: { '@id': ORG_ID },
  },
)

export default function UeberUnsPage() {
  return (
    <div className='container max-w-5xl py-16 space-y-16'>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='max-w-2xl space-y-5'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          Über uns
        </p>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
          EventShot – ein Produkt von EdelByte
        </h1>
        <p className='text-lg text-muted-foreground'>
          Hinter der Live-Fotowand steht kein anonymer Anbieter, sondern
          EdelByte Veliji aus Turbenthal im Zürcher Oberland. Entwickelt,
          betrieben und beantwortet wird EventShot am selben Ort. Diese Seite
          sagt dir, was das für dein Fest bedeutet.
        </p>
      </div>

      <section className='space-y-6'>
        <div className='space-y-2'>
          <h2 className='text-2xl md:text-3xl font-bold'>Das Unternehmen</h2>
          <p className='max-w-2xl text-muted-foreground'>
            Diese Angaben stehen so auch im Impressum. Du sollst wissen, mit
            wem du es zu tun hast, bevor du buchst.
          </p>
        </div>
        <dl className='grid gap-4 sm:grid-cols-2'>
          {FAKTEN.map((fakt) => (
            <div
              key={fakt.label}
              className='rounded-2xl border border-border bg-card p-5'
            >
              <dt className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                {fakt.label}
              </dt>
              <dd className='mt-1 font-medium'>{fakt.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className='space-y-6'>
        <div className='space-y-2'>
          <h2 className='text-2xl md:text-3xl font-bold'>
            Vier Entscheidungen, die das Produkt prägen
          </h2>
          <p className='max-w-2xl text-muted-foreground'>
            EventShot kann bewusst nicht alles. Was es kann, folgt aus vier
            Festlegungen, die wir nicht dem Zufall überlassen haben.
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          {ENTSCHEIDUNGEN.map((punkt) => (
            <ScrollReveal key={punkt.title}>
              <div className='flex h-full flex-col rounded-2xl border border-border bg-card p-6'>
                <punkt.icon className='size-5 text-primary' />
                <h3 className='mt-4 font-semibold'>{punkt.title}</h3>
                <p className='mt-1.5 flex-1 text-sm text-muted-foreground'>
                  {punkt.copy}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl md:text-3xl font-bold'>
          Wofür EventShot gebaut ist
        </h2>
        <p className='max-w-2xl text-muted-foreground'>
          Der Zuschnitt ist privat: Hochzeit, Geburtstag, Taufe, Jubiläum,
          Konfirmation, Familienfest und der überschaubare Firmenanlass mit
          Apéro oder Firmenessen. Für solche Abende genügt ein Bildschirm, ein
          QR-Code auf dem Tisch und eine Galerie, die danach noch eine Weile
          offen bleibt.
        </p>
        <p className='max-w-2xl text-muted-foreground'>
          Wird der Anlass grösser – Konferenz, Messe, Firmenfest mit mehreren
          hundert Teilnehmenden –, ist{' '}
          <a
            href='https://social-wall.ch'
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary hover:underline'
          >
            social-wall.ch
          </a>{' '}
          die passende Adresse. Das Schwesterprodukt kommt aus demselben Haus
          und ist auf diese Grössenordnung ausgelegt.
        </p>
      </section>

      <section className='space-y-5 rounded-2xl border border-border bg-card p-8'>
        <h2 className='text-xl font-semibold text-primary'>
          Fragen an die Leute dahinter
        </h2>
        <p className='text-muted-foreground'>
          Wenn du wissen willst, ob EventShot zu deinem Anlass passt, frag
          einfach nach. Antworten kommen von derselben Adresse, die auch das
          Produkt betreibt.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button asChild size='lg'>
            <Link href='/kontakt'>
              Zum Kontakt
              <ArrowRight className='size-4' />
            </Link>
          </Button>
          <Button asChild size='lg' variant='outline'>
            <Link href='/anlaesse'>Anlässe ansehen</Link>
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>
          Rechtliches im Detail:{' '}
          <Link href='/impressum' className='text-primary hover:underline'>
            Impressum
          </Link>
          ,{' '}
          <Link href='/datenschutz' className='text-primary hover:underline'>
            Datenschutz
          </Link>{' '}
          und{' '}
          <Link href='/agb' className='text-primary hover:underline'>
            AGB
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
