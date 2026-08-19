import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ui/motion'
import { buildMetadata } from '@/lib/seo/metadata'
import { ORG_ID, SITE, WEBSITE_ID, breadcrumbNode, graph } from '@/lib/seo/schema'

export const metadata: Metadata = buildMetadata({
  path: '/kontakt',
  title: 'Kontakt – EventShot Support aus der Schweiz',
  description:
    'Fragen zur Live-Fotowand? Schreib an info@edelbyte.ch oder ruf an unter 044 500 25 04. Antwort aus der Schweiz, DSG-konform.',
})

const KANAELE = [
  {
    icon: Mail,
    label: 'E-Mail',
    value: 'info@edelbyte.ch',
    href: 'mailto:info@edelbyte.ch',
    copy: 'Der Weg für alles Schriftliche: Fragen zu einem Paket, zur Rechnung oder zu einem Event, das du bereits angelegt hast.',
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '044 500 25 04',
    href: 'tel:+41445002504',
    copy: 'Lieber sprechen statt tippen? Ruf an, wenn sich deine Frage in zwei Minuten klären lässt.',
  },
  {
    icon: MapPin,
    label: 'Adresse',
    value: 'Zihlackerring 6, 8488 Turbenthal',
    href: null,
    copy: 'Postanschrift von EdelByte Veliji im Zürcher Oberland – für Rechnungen und Schriftverkehr.',
  },
] as const

const ANGABEN = [
  'Datum und Art des Anlasses, also Hochzeit, Geburtstag, Taufe oder Team-Event.',
  'Ungefähre Anzahl Gäste – daraus ergibt sich, welches Paket zu dir passt.',
  'Was am Veranstaltungsort schon steht: Beamer, TV oder gar kein Bildschirm.',
  'Wie lange du nach dem Fest auf die digitale Galerie zugreifen möchtest.',
  'Bei einer bestehenden Buchung: der Name deines Events aus dem Konto.',
]

const HINWEISE = [
  {
    title: 'Passt EventShot zu meinem Anlass?',
    href: '/anlaesse',
    copy: 'Die Übersicht zeigt pro Feier den Ablauf, das empfohlene Paket und die häufigsten Fragen.',
  },
  {
    title: 'Müssen Gäste etwas installieren?',
    href: '/fotobox-ohne-app',
    copy: 'Warum der QR-Code genügt und niemand im App Store etwas suchen muss.',
  },
  {
    title: 'Was kostet das Ganze?',
    href: '/preise',
    copy: 'Drei Pakete zum Einmalpreis pro Event – Registrierung kostenlos, du zahlst erst beim Buchen.',
  },
  {
    title: 'Wo liegen die Bilder?',
    href: '/datenschutz',
    copy: 'Die Datenschutzerklärung beschreibt Speicherung in der Schweiz und die automatische Löschung.',
  },
]

const jsonLd = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Kontakt', path: '/kontakt' },
  ]),
  {
    '@type': 'ContactPage',
    '@id': `${SITE.url}/kontakt#contactpage`,
    url: `${SITE.url}/kontakt`,
    name: 'Kontakt',
    description:
      'Kontaktmöglichkeiten für EventShot: E-Mail, Telefon und Postadresse von EdelByte Veliji in Turbenthal.',
    inLanguage: SITE.locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    mainEntity: {
      '@type': 'Organization',
      '@id': ORG_ID,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+41445002504',
        email: 'info@edelbyte.ch',
        contactType: 'customer support',
        areaServed: 'CH',
        availableLanguage: ['de', 'de-CH'],
      },
    },
  },
)

export default function KontaktPage() {
  return (
    <div className='container max-w-5xl py-16 space-y-16'>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='max-w-2xl space-y-5'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          EventShot Support
        </p>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
          Kontakt
        </h1>
        <p className='text-lg text-muted-foreground'>
          Offene Frage zur Live-Fotowand, zu einem Paket oder zum Bildschirm am
          Veranstaltungsort? Schreib uns eine kurze Nachricht oder greif zum
          Telefon. Beides landet direkt bei EdelByte in Turbenthal – ein Konto
          brauchst du dafür nicht.
        </p>
      </div>

      <section className='space-y-6'>
        <h2 className='text-2xl md:text-3xl font-bold'>So erreichst du uns</h2>
        <div className='grid gap-4 sm:grid-cols-3'>
          {KANAELE.map((kanal) => (
            <ScrollReveal key={kanal.label}>
              <div className='flex h-full flex-col rounded-2xl border border-border bg-card p-6'>
                <kanal.icon className='size-5 text-primary' />
                <span className='mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                  {kanal.label}
                </span>
                {kanal.href ? (
                  <a
                    href={kanal.href}
                    className='mt-1 font-semibold text-primary hover:underline'
                  >
                    {kanal.value}
                  </a>
                ) : (
                  <span className='mt-1 font-semibold'>{kanal.value}</span>
                )}
                <p className='mt-3 flex-1 text-sm text-muted-foreground'>
                  {kanal.copy}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className='space-y-6'>
        <div className='space-y-2'>
          <h2 className='text-2xl md:text-3xl font-bold'>
            Das gehört in deine Nachricht
          </h2>
          <p className='max-w-2xl text-muted-foreground'>
            Je mehr wir über deinen Anlass wissen, desto konkreter fällt die
            Antwort aus. Diese fünf Angaben reichen in den meisten Fällen.
          </p>
        </div>
        <ul className='grid gap-3 sm:grid-cols-2'>
          {ANGABEN.map((angabe) => (
            <li
              key={angabe}
              className='rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground'
            >
              {angabe}
            </li>
          ))}
        </ul>
        <Button asChild size='lg'>
          <a href='mailto:info@edelbyte.ch'>
            Nachricht an info@edelbyte.ch
            <ArrowRight className='size-4' />
          </a>
        </Button>
      </section>

      <section className='space-y-6'>
        <div className='space-y-2'>
          <h2 className='text-2xl md:text-3xl font-bold'>
            Vielleicht steht die Antwort schon hier
          </h2>
          <p className='max-w-2xl text-muted-foreground'>
            Vier Fragen kommen besonders oft. Für jede gibt es eine Seite, die
            weiter geht als eine kurze Antwort per Mail.
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          {HINWEISE.map((hinweis) => (
            <ScrollReveal key={hinweis.href}>
              <Link
                href={hinweis.href}
                className='group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50'
              >
                <h3 className='font-semibold'>{hinweis.title}</h3>
                <p className='mt-1.5 flex-1 text-sm text-muted-foreground'>
                  {hinweis.copy}
                </p>
                <span className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5'>
                  Ansehen
                  <ArrowRight className='size-4' />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className='space-y-4 rounded-2xl border border-border bg-card p-6'>
        <h2 className='text-xl font-semibold text-primary'>
          Wer antwortet dir
        </h2>
        <p className='text-muted-foreground'>
          EventShot wird von EdelByte Veliji betrieben, einem Einzelunternehmen
          mit Sitz in Turbenthal (UID CHE-365.373.264). Was hinter dem Produkt
          steht, beschreibt die Seite{' '}
          <Link href='/ueber-uns' className='text-primary hover:underline'>
            Über uns
          </Link>
          ; die vollständigen Anbieterangaben findest du im{' '}
          <Link href='/impressum' className='text-primary hover:underline'>
            Impressum
          </Link>
          .
        </p>
        <p className='text-sm text-muted-foreground'>
          Geht es um einen Grossanlass mit vielen Teilnehmenden? Dann führt die
          Anfrage zum Schwesterprodukt{' '}
          <a
            href='https://social-wall.ch'
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary hover:underline'
          >
            social-wall.ch
          </a>{' '}
          – ebenfalls von EdelByte, mit denselben Kontaktdaten.
        </p>
      </section>
    </div>
  )
}
