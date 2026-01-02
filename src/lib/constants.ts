export const siteConfig = {
  name: 'EventShot',
  description: 'Live Foto-Sharing Plattform für Veranstaltungen',
  navItems: [
    { label: 'Start', href: '/' },
    { label: 'Funktionen', href: '/#features' },
    { label: "So funktioniert's", href: '/#how-it-works' },
    { label: 'Kundenstimmen', href: '/#testimonials' },
    { label: 'Preise', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
  ],
  adminNavItems: [
    { label: 'Start', href: '/' },
    { label: 'Einstellungen', href: '/settings' },
  ],
}

export const features = [
  {
    title: 'Sofortiges Teilen',
    description:
      'Gäste scannen einen QR-Code, laden Fotos hoch und sehen sie in Sekunden auf dem Bildschirm.',
    icon: 'Camera',
  },
  {
    title: 'Live Slideshow',
    description:
      'Schöne Übergänge zwischen den Fotos halten Ihre Event-Wand dynamisch und ansprechend.',
    icon: 'Projector',
  },
  {
    title: 'Digitale Galerie',
    description:
      'Alle Fotos werden in einer digitalen Galerie gespeichert, auf die Gäste nach der Veranstaltung zugreifen können.',
    icon: 'Image',
  },
]

export const howItWorks = [
  {
    title: 'Event einrichten',
    description:
      'Erstellen Sie Ihr Event in Minuten mit individuellem Branding und Display-Einstellungen.',
    step: 1,
  },
  {
    title: 'QR-Code teilen',
    description:
      'Zeigen Sie den einzigartigen QR-Code an Ihrem Veranstaltungsort zum Scannen an.',
    step: 2,
  },
  {
    title: 'Gäste laden Fotos hoch',
    description:
      'Teilnehmer scannen und laden Fotos von ihren Smartphones hoch - keine App erforderlich.',
    step: 3,
  },
  {
    title: 'Live-Anzeige',
    description:
      'Fotos erscheinen sofort auf der Event-Anzeige mit schönen Animationen.',
    step: 4,
  },
]

export const testimonials = [
  {
    quote:
      'EventShot hat unsere Hochzeitsfeier verwandelt. Die Gäste liebten es, ihre Fotos auf dem Bildschirm zu sehen, und wir bekamen viel mehr spontane Momente als unser Fotograf allein hätte einfangen können.',
    author: 'Lina & Marc',
    role: 'Frisch verheiratet',
  },
  {
    quote:
      'Als Eventplaner habe ich EventShot zu einem Standardangebot für Firmenveranstaltungen gemacht. Es fördert das Engagement und schafft ein unterhaltsames, interaktives Element, das die Kunden lieben.',
    author: 'Sandro Meier',
    role: 'Eventmanager',
  },
  {
    quote:
      'Wir nutzen EventShot auf unseren Konferenzen, um Gemeinschaft aufzubauen. Die Live-Fotowand wird zum Gesprächsthema und hilft den Teilnehmern, sich verbunden zu fühlen.',
    author: 'Andrea Kunz',
    role: 'Konferenzleiterin',
  },
]

export const faqs = [
  {
    question: 'Müssen Gäste eine App herunterladen?',
    answer:
      'Nein! EventShot funktioniert direkt im Browser des Smartphones. Einfach QR-Code scannen, Webseite öffnen und Fotos hochladen - keine App oder Konto erforderlich.',
  },
  {
    question: 'Kann ich die Fotos moderieren?',
    answer:
      'Absolut. Sie können zwischen automatischer Freigabe oder einer Moderationswarteschlange wählen, bei der Sie jedes Foto vor der Anzeige genehmigen.',
  },
  {
    question: 'Welche Ausrüstung wird benötigt?',
    answer:
      'Nur ein Bildschirm oder Projektor, der mit einem Gerät verbunden ist, das einen Webbrowser anzeigen kann, wie ein Laptop oder Tablet. Wir empfehlen eine stabile Internetverbindung für das beste Erlebnis.',
  },
  {
    question: 'Wie viele Fotos können hochgeladen werden?',
    answer:
      'Unser Standardpaket beinhaltet unbegrenzte Foto-Uploads während Ihrer Veranstaltung und 30 Tage Galerie-Zugriff danach.',
  },
  {
    question: 'Können Gäste die Fotos herunterladen?',
    answer:
      'Ja! Alle Fotos werden in einer digitalen Galerie gespeichert, auf die Gäste nach der Veranstaltung über denselben QR-Code oder einen von Ihnen bereitgestellten Link zugreifen können.',
  },
  {
    question: 'Gibt es eine Begrenzung der Veranstaltungsdauer?',
    answer:
      'Unsere Pakete sind für Veranstaltungen von wenigen Stunden bis hin zu mehrtägigen Konferenzen verfügbar. Kontaktieren Sie uns für individuelle Pakete für längere Veranstaltungen.',
  },
]

export const pricingPlans = [
  {
    name: 'Basic',
    price: 'CHF 49.-',
    duration: 'pro Event',
    description: 'Geburtstage, kleine Familienfeste, private Anlässe',
    features: [
      'Unbegrenzte Foto-Uploads',
      'Live-Slideshow',
      'Grundlegende Moderation',
      'Digitale Galerie für 7 Tage',
    ],
    highlighted: false,
  },
  {
    name: 'Premium',
    price: 'CHF 99.-',
    duration: 'pro Event',
    description: 'Hochzeiten, runde Geburtstage, Vereinsfeste',
    features: [
      'Unbegrenzte Foto-Uploads',
      'Live-Slideshow mit einstellbarer Anzeigedauer',
      'Slideshow-Steuerung ein-/ausblendbar',
      'Erweiterte Moderation',
      'Digitale Galerie für 30 Tage',
      'Prioritäts-Support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'CHF 149.-',
    duration: 'pro Event',
    description: 'Firmenanlässe, Konferenzen, Messen, Galas',
    features: [
      'Unbegrenzte Foto-Uploads',
      'Live-Slideshow mit erweiterten Einstellungen',
      'Slideshow-Steuerung konfigurierbar',
      'Komplette Moderationssuite',
      'Digitale Galerie für 90 Tage',
      'Wasserzeichen optional deaktivierbar',
      'Eigenes Branding in der Slideshow',
      'Persönlicher Support',
    ],
    highlighted: false,
  },
]
