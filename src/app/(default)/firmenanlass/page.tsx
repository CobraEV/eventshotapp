import type { Metadata } from 'next'
import {
  type UseCaseContent,
  UseCasePage,
} from '@/components/landing/use-case-page'

export const metadata: Metadata = {
  title: 'EventShot für Firmenanlässe – Live-Fotowand & Slideshow',
  description:
    'Live-Fotowand für Firmenanlässe, Konferenzen und Galas: Gäste laden Fotos per QR-Code hoch, Anzeige auf mehreren Screens, eigenes Branding. DSG-konform, Schweizer Hosting.',
  alternates: { canonical: 'https://eventshot.ch/firmenanlass' },
  openGraph: {
    title: 'EventShot für Firmenanlässe',
    description:
      'Live-Fotowand mit Branding für Firmenanlässe, Konferenzen und Galas – DSG-konform, Schweizer Hosting.',
    url: 'https://eventshot.ch/firmenanlass',
  },
}

const content: UseCaseContent = {
  eyebrow: 'EventShot für Firmenanlässe',
  title: 'Firmenanlässe, die alle teilen.',
  intro:
    'Vom Mitarbeiterfest bis zur Konferenz: EventShot bringt die Fotos eurer Gäste live auf grosse Screens – mit eigenem Branding und digitaler Galerie danach. Ganz ohne App für die Teilnehmenden.',
  ablaufTitle: 'So läuft euer Anlass',
  ablauf: [
    {
      title: 'Event & Branding einrichten',
      copy: 'Event anlegen, eigenes Logo in der Slideshow hinterlegen, QR-Code generieren – alles selbst.',
    },
    {
      title: 'Teilnehmende laden hoch',
      copy: 'Gäste scannen den QR-Code und teilen Fotos ohne App – sofort sichtbar auf den Screens.',
    },
    {
      title: 'Galerie danach',
      copy: 'Nach dem Anlass steht die digitale Galerie für Download und interne Nutzung bereit.',
    },
  ],
  featuresTitle: 'Was zu eurem Anlass passt',
  features: [
    'Foto-Upload per QR-Code, ganz ohne App',
    'Mehrere Slideshow-Screens gleichzeitig',
    'Eigenes Branding in der Slideshow',
    'Wasserzeichen optional deaktivierbar',
    'DSG-konform, Schweizer Hosting',
    'Automatische Löschung nach Galerie-Ablauf',
  ],
  planName: 'Enterprise',
  planPrice: 'CHF 149.-',
  planReason:
    'Für Firmenanlässe passt Enterprise: unbegrenzte Slideshow-Screens, eigenes Branding, deaktivierbares Wasserzeichen und 90 Tage digitale Galerie.',
  faq: [
    {
      question: 'Können wir die Slideshow auf mehreren Screens zeigen?',
      answer:
        'Ja. Premium unterstützt bis zu 3 Screens, Enterprise unbegrenzt viele – ideal für grosse Räume oder mehrere Standorte.',
    },
    {
      question: 'Lässt sich die Slideshow branden?',
      answer:
        'Ja. Im Enterprise-Plan hinterlegt ihr euer eigenes Logo und könnt das EventShot-Wasserzeichen deaktivieren.',
    },
    {
      question: 'Wo liegen die Fotos und wie lange?',
      answer:
        'Alle Fotos liegen DSG-konform auf unseren Schweizer Servern. Die Galerie bleibt im Enterprise-Plan 90 Tage verfügbar und wird danach automatisch gelöscht.',
    },
  ],
  ctaTitle: 'Bereit für euren Anlass?',
  ctaText:
    'Richtet euer Firmen-Event in wenigen Minuten ein – Registrierung kostenlos, ihr zahlt erst beim Buchen.',
}

export default function FirmenanlassPage() {
  return <UseCasePage content={content} />
}
