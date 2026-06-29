import type { Metadata } from 'next'
import {
  type UseCaseContent,
  UseCasePage,
} from '@/components/landing/use-case-page'

export const metadata: Metadata = {
  title:
    'Live-Fotowand für kleine Firmenanlässe – Team-Event & Apéro | EventShot',
  description:
    'Die Live-Fotowand & Slideshow für kleine Firmenanlässe: Team-Event, Apéro, kleine Weihnachtsfeier oder Firmenessen. Gäste laden Fotos per QR-Code hoch, eigenes Branding, digitale Galerie danach. Grosser Anlass mit vielen Gästen? → social-wall.ch.',
  alternates: { canonical: 'https://eventshot.ch/firmenanlass' },
  openGraph: {
    title: 'Live-Fotowand für kleine Firmenanlässe & Team-Events',
    description:
      'Live-Fotowand mit Branding für Team-Event, Apéro & kleine Firmenfeiern – DSG-konform, Schweizer Hosting. Grossanlass mit vielen Gästen? → social-wall.ch.',
    url: 'https://eventshot.ch/firmenanlass',
  },
}

const content: UseCaseContent = {
  eyebrow: 'EventShot für kleine Firmenanlässe',
  title: 'Team-Events, die alle teilen.',
  intro:
    'Vom Team-Event über den Apéro bis zur kleinen Weihnachtsfeier oder zum Firmenessen: EventShot bringt die Fotos eures Teams live als Slideshow auf den Screen – mit eigenem Branding und digitaler Galerie danach. Ganz ohne App für die Teilnehmenden. Planst du einen grossen Firmenanlass oder eine Konferenz mit vielen Gästen? Dafür gibt es unsere Live-Fotowand für Grossanlässe → social-wall.ch.',
  ablaufTitle: 'So läuft euer Anlass',
  ablauf: [
    {
      title: 'Event & Branding einrichten',
      copy: 'Event anlegen, eigenes Logo in der Slideshow hinterlegen, QR-Code generieren – alles selbst.',
    },
    {
      title: 'Team lädt hoch',
      copy: 'Eure Mitarbeitenden scannen den QR-Code und teilen Fotos ohne App – sofort sichtbar als Slideshow.',
    },
    {
      title: 'Galerie danach',
      copy: 'Nach dem Anlass steht die digitale Galerie für Download und interne Nutzung bereit.',
    },
  ],
  featuresTitle: 'Was zu eurem Team-Event passt',
  features: [
    'Foto-Upload per QR-Code, ganz ohne App',
    'Live-Slideshow auf TV oder Beamer',
    'Eigenes Branding in der Slideshow',
    'Wasserzeichen optional deaktivierbar',
    'DSG-konform, Schweizer Hosting',
    'Automatische Löschung nach Galerie-Ablauf',
  ],
  planName: 'Premium',
  planPrice: 'CHF 99.-',
  planReason:
    'Für überschaubare Team-Events, Apéros und kleine Firmenfeiern passt Premium: bis zu 3 Slideshow-Screens, eigenes Branding und 30 Tage digitale Galerie. Für Grossanlässe mit vielen Gästen empfehlen wir social-wall.ch.',
  faq: [
    {
      question: 'Eignet sich EventShot für unser Team-Event oder den Apéro?',
      answer:
        'Ja – EventShot ist ideal für überschaubare Firmenanlässe wie Team-Events, Apéros, kleine Weihnachtsfeiern oder Firmenessen. Für Grossanlässe und Konferenzen mit vielen Gästen empfehlen wir unser Schwesterprodukt social-wall.ch.',
    },
    {
      question: 'Lässt sich die Slideshow branden?',
      answer:
        'Ja. Ihr hinterlegt euer eigenes Logo in der Slideshow und könnt das EventShot-Wasserzeichen deaktivieren.',
    },
    {
      question: 'Wo liegen die Fotos und wie lange?',
      answer:
        'Alle Fotos liegen DSG-konform auf unseren Schweizer Servern. Die Galerie bleibt im Premium-Plan 30 Tage verfügbar und wird danach automatisch gelöscht.',
    },
  ],
  ctaTitle: 'Bereit für euren Anlass?',
  ctaText:
    'Richtet euer Firmen-Event in wenigen Minuten ein – Registrierung kostenlos, ihr zahlt erst beim Buchen.',
  breadcrumb: {
    name: 'Firmenanlass',
    path: 'https://eventshot.ch/firmenanlass',
  },
}

export default function FirmenanlassPage() {
  return (
    <>
      <UseCasePage content={content} />
      <div className='container max-w-5xl pb-16'>
        <div className='rounded-2xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground'>
          Grosser Firmenanlass oder Konferenz mit vielen Gästen?{' '}
          <a
            href='https://social-wall.ch'
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium text-primary hover:underline'
          >
            Grossanlass / Firmenevent-Fotowand → social-wall.ch
          </a>
        </div>
      </div>
    </>
  )
}
