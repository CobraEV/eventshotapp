import type { Metadata } from 'next'
import {
  type UseCaseContent,
  UseCasePage,
} from '@/components/landing/use-case-page'

export const metadata: Metadata = {
  title: 'EventShot für deine Hochzeit – Live-Fotowand & Slideshow',
  description:
    'Eure Gäste teilen ihre schönsten Hochzeitsfotos per QR-Code – live auf der Slideshow und danach in einer digitalen Galerie. Ohne App, DSG-konform, Schweizer Hosting.',
  alternates: { canonical: 'https://eventshot.ch/hochzeit' },
  openGraph: {
    title: 'EventShot für deine Hochzeit',
    description:
      'Live-Fotowand & digitale Galerie für eure Hochzeit – ohne App, DSG-konform, Schweizer Hosting.',
    url: 'https://eventshot.ch/hochzeit',
  },
}

const content: UseCaseContent = {
  eyebrow: 'EventShot für Hochzeiten',
  title: 'Eure Hochzeit, geteilt in Echtzeit.',
  intro:
    'Jeder Gast hält andere Momente fest. Mit EventShot landen sie alle an einem Ort: Gäste laden ihre Fotos per QR-Code hoch, sehen sie live auf der Slideshow – und ihr habt nach dem Fest eine digitale Galerie mit allen Bildern.',
  ablaufTitle: 'So läuft euer Hochzeitstag',
  ablauf: [
    {
      title: 'QR-Code aufstellen',
      copy: 'Stellt den QR-Code auf die Tische oder beim Eingang auf. Gäste scannen ihn mit dem Handy.',
    },
    {
      title: 'Gäste laden hoch',
      copy: 'Ohne App und ohne Konto: Foto auswählen, hochladen – fertig. Es erscheint sofort auf der Leinwand.',
    },
    {
      title: 'Galerie danach',
      copy: 'Nach dem Fest greift ihr über denselben QR-Code auf die digitale Galerie mit allen Fotos zu.',
    },
  ],
  featuresTitle: 'Was zu eurer Hochzeit passt',
  features: [
    'Foto-Upload per QR-Code, ganz ohne App',
    'Live-Slideshow auf Beamer oder TV',
    'Digitale Galerie für alle Gäste',
    'Schöne Übergänge und Animationen',
    'DSG-konform, Schweizer Hosting',
    'Automatische Löschung nach Galerie-Ablauf',
  ],
  planName: 'Premium',
  planPrice: 'CHF 99.-',
  planReason:
    'Für Hochzeiten empfehlen wir Premium: bis zu 3 Slideshow-Screens, einstellbare Anzeigedauer und 30 Tage digitale Galerie – genug Zeit, alle Fotos in Ruhe herunterzuladen.',
  faq: [
    {
      question: 'Müssen unsere Gäste eine App installieren?',
      answer:
        'Nein. Gäste scannen den QR-Code, öffnen die Webseite und laden Fotos hoch – ganz ohne App und ohne Konto.',
    },
    {
      question: 'Wie lange haben wir Zugriff auf die Fotos?',
      answer:
        'Im Premium-Plan bleibt die digitale Galerie 30 Tage nach der Hochzeit verfügbar. Danach werden die Fotos automatisch und DSG-konform von unseren Schweizer Servern gelöscht.',
    },
    {
      question: 'Was brauchen wir im Festsaal?',
      answer:
        'Einen Beamer oder TV mit Browser und eine Internetverbindung. Ihr öffnet die Slideshow im Browser – mehr braucht es nicht.',
    },
  ],
  ctaTitle: 'Bereit für eure Foto-Wand?',
  ctaText:
    'Richtet euer Hochzeits-Event in wenigen Minuten ein – Registrierung kostenlos, ihr zahlt erst beim Buchen.',
}

export default function HochzeitPage() {
  return <UseCasePage content={content} />
}
