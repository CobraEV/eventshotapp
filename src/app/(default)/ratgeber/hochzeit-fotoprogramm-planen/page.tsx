import type { Metadata } from 'next'
import {
  type ArticleContent,
  ArticlePage,
} from '@/components/landing/article-page'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  path: '/ratgeber/hochzeit-fotoprogramm-planen',
  title: 'Fotoprogramm der Hochzeit planen – Ablauf',
  description:
    'Vom Apéro bis zum letzten Tanz: Wann Gästefotos entstehen, wann die Slideshow läuft und wie ihr das mit dem Fotografen abstimmt.',
})

const content: ArticleContent = {
  eyebrow: 'Planung',
  title: 'Das Fotoprogramm eurer Hochzeit planen',
  lead: 'Das Fotoprogramm ist kein eigener Programmpunkt, sondern eine Schicht über eurem Tagesablauf: Nur die Blöcke mit dem Fotografen brauchen echte Zeit im Plan, alles Übrige läuft nebenher und wird an drei, vier Stellen kurz angestossen. Wer stattdessen einen Fotoblock ins Programm schreibt, verliert Zeit und erntet gestellte Bilder.',
  path: '/ratgeber/hochzeit-fotoprogramm-planen',
  datePublished: '2026-08-19',
  readingMinutes: 7,
  blocks: [
    {
      type: 'heading',
      text: 'Die zwei Fotoströme eures Tages',
    },
    {
      type: 'paragraph',
      text: 'An eurer Hochzeit entstehen zwei völlig verschiedene Sorten Bilder. Der Fotograf liefert die geplanten: Trauung, Paarbilder, Gruppenaufnahme, Porträts am Abend. Die Gäste liefern die ungeplanten: der Blick von Tisch sieben auf euren ersten Tanz, das Lachen der Grossmutter beim Apéro, die Kinder unter dem Buffettisch. Die erste Sorte braucht Platz im Zeitplan, die zweite braucht nur einen Anlass und eine sichtbare Gelegenheit.',
    },
    {
      type: 'paragraph',
      text: 'Diese Trennung ist der ganze Kniff. Ihr plant nicht, wann eure Gäste fotografieren – das entscheiden sie selbst und meistens besser, als es ein Plan könnte. Ihr plant, wann ihr sie darauf hinweist, wann ihre Bilder sichtbar werden und wann der Fotograf ungestört arbeiten kann.',
    },
    {
      type: 'heading',
      text: 'Der Tag vom Empfang bis Mitternacht',
    },
    {
      type: 'paragraph',
      text: 'Geht euren Ablauf einmal durch und notiert zu jedem Abschnitt, welche Bilder dort entstehen und von wem:',
    },
    {
      type: 'list',
      items: [
        'Ankunft und Empfang: viele Handys, wenig Ordnung. Hier entstehen die spontansten Gästefotos des ganzen Tages.',
        'Trauung: der Abschnitt, der dem Fotografen gehört. Ausgestreckte Arme im Mittelgang stehen genau dort, wo seine Bilder entstehen.',
        'Gratulation und Apéro: die dichteste Phase, weil alle stehen, reden und sich zum ersten Mal begegnen.',
        'Paarshooting: ihr seid weg. Diese Lücke füllen die Gäste mit sich selbst – und mit der Kamera.',
        'Essen und Ansprachen: wenig Bewegung, dafür Nahaufnahmen vom eigenen Tisch und von den Menschen am Mikrofon.',
        'Torte, Eröffnungstanz und später Abend: die Bilder, die niemand doppelt hat, weil jeder aus einem anderen Winkel schaut.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Aus dieser Liste ergibt sich das Fotoprogramm fast von selbst. Nur zwei Phasen verlangen eine bewusste Entscheidung: die Trauung, weil Gästefotos dort stören können, und das Paarshooting, weil eine gute Stunde ohne euch vergeht, die sich mit einer sichtbaren Fotowand angenehm füllen lässt.',
    },
    {
      type: 'heading',
      text: 'Wann die Slideshow läuft – und wann nicht',
    },
    {
      type: 'paragraph',
      text: 'Eine Live-Slideshow ist kein Dauerzustand, sondern ein Programmpunkt mit Ein- und Ausschaltzeiten. Sie trägt dort, wo ohnehin gestanden und geschaut wird: beim Apéro, während eurer Abwesenheit fürs Paarshooting, in der Pause zwischen Hauptgang und Dessert und am späten Abend neben der Tanzfläche.',
    },
    {
      type: 'paragraph',
      text: 'Aus bleibt sie während der Trauung, während der Ansprachen und beim Eröffnungstanz, sofern die Leinwand im Rücken der sprechenden oder tanzenden Menschen hängt. Eine wechselnde Bildfläche zieht Blicke zuverlässig von jeder Person weg, die gerade etwas Persönliches sagt.',
    },
    {
      type: 'paragraph',
      text: 'Habt ihr nur eine Fläche im Saal und hängt sie hinter dem Brauttisch, plant den Wechsel bewusst: Slideshow beim Apéro, Pause zu den Reden, wieder an, sobald die Musik läuft. Zwei Handgriffe an einem Abend, mehr ist es nicht.',
    },
    {
      type: 'heading',
      text: 'Der Zeitplan, Schritt für Schritt',
    },
    {
      type: 'ordered',
      items: [
        'Schreibt euren Tagesablauf mit Uhrzeiten auf – ihr braucht ihn ohnehin für Trauzeugen, Location und Musik.',
        'Tragt die Blöcke ein, die dem Fotografen gehören: Vorbereitung, Trauung, Gruppenaufnahme, Paarshooting, Details im Saal.',
        'Legt einen einzigen Zeitpunkt für das grosse Gruppenbild fest, am besten direkt nach der Gratulation, solange alle beisammen sind.',
        'Markiert die Fenster, in denen die Slideshow laufen soll, und die Zeiten, in denen sie ausgeschaltet bleibt.',
        'Bestimmt zwei Momente für die Ansage an die Gäste: einen beim Apéro, einen nach dem Hauptgang.',
        'Benennt eine Person, die die Slideshow startet, die Aufsteller verteilt und am späten Abend einmal kurz nachschaut – Trauzeugin, Trauzeuge oder wer durch den Abend führt.',
        'Legt einen Puffer in den Nachmittag. Er wird gebraucht, und falls nicht, habt ihr Bilder ohne Zeitdruck.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Der wichtigste Punkt ist der sechste. Ein Fotoprogramm, das an eurem eigenen Handy hängt, funktioniert nicht: Ihr seid an diesem Tag die einzigen beiden Menschen im Raum, die keine freie Minute haben.',
    },
    {
      type: 'heading',
      text: 'Die Abstimmung mit dem Fotografen',
    },
    {
      type: 'paragraph',
      text: 'Zwei Dinge muss der Fotograf von euch wissen: welche Gruppenbilder ihr wollt und ob während der Trauung Gästefotos erwünscht sind. Alles Weitere ist sein Handwerk. Schickt ihm den Ablauf einige Tage vorher und die Gruppen als Namensliste statt als Umschreibung. Wer die Gruppen vorher aufschreibt und nacheinander aufruft, gewinnt mehr Zeit zurück, als jede Kürzung des Shootings einbringt.',
    },
    {
      type: 'paragraph',
      text: 'Für den Auszug aus Kirche oder Trausaal lohnt sich die Bitte an die Gäste, die Handys für diese wenigen Minuten liegen zu lassen. Nicht aus Prinzip, sondern weil erhobene Arme im Mittelgang genau die Aufnahmen verstellen, für die ihr den Fotografen bezahlt. Danach dürfen alle wieder – und ab dem Apéro sind Gästefotos ein Gewinn statt ein Störfaktor.',
    },
    {
      type: 'paragraph',
      text: 'Umgekehrt gilt: Gästefotos ersetzen keinen Fotografen. Sie zeigen Perspektiven, die er nicht einnehmen kann, liefern aber keine gleichmässig belichteten Porträts und keine verlässliche Dokumentation des Tages. Wer beim Budget sparen muss, kürzt eher die gebuchten Stunden als die Person.',
    },
    {
      type: 'heading',
      text: 'Die zwei Ansagen, die den Unterschied machen',
    },
    {
      type: 'paragraph',
      text: 'Gedruckte Karten holen einen Teil eurer Gäste ab. Den grösseren Teil erreicht eine gesprochene Aufforderung, weil sie den Moment erzeugt, in dem alle gleichzeitig zum Handy greifen. Zwei kurze Ansagen genügen: eine beim Apéro, wenn die Stimmung offen ist und noch niemand sitzt, und eine nach dem Hauptgang, weil die schönsten Bilder des Abends da erst noch entstehen.',
    },
    {
      type: 'paragraph',
      text: 'Formuliert sie als Einladung und nennt den Grund. Ein Satz wie «Wir sehen heute nur einen Ausschnitt von unserem eigenen Fest – zeigt uns euren» wirkt anders als der blosse Verweis auf ein Kärtchen am Tisch.',
    },
    {
      type: 'heading',
      text: 'Was am Tag danach zählt',
    },
    {
      type: 'paragraph',
      text: 'Das Fotoprogramm endet nicht mit dem letzten Tanz. Klärt vorher, wie lange die Bilder abrufbar bleiben und wer sie herunterlädt. Bei EventShot bleiben die Gästefotos danach als digitale Galerie erreichbar, über denselben QR-Code, den eure Gäste am Abend gescannt haben: mit Basic 7 Tage, mit Premium 30 Tage, mit Enterprise 90 Tage. Nach Ablauf werden sie automatisch und DSG-konform von den Schweizer Servern gelöscht.',
    },
    {
      type: 'paragraph',
      text: 'Setzt euch dieses Ablaufdatum in den Kalender, bevor ihr in die Flitterwochen fahrt. Die Wochen nach der Hochzeit vergehen schnell, und die Bilder eurer Gäste sind der einzige Teil eurer Hochzeitsfotos, den ihr kein zweites Mal anfordern könnt.',
    },
    {
      type: 'note',
      text: 'Plant ihr mit mehreren hundert Gästen, mit mehreren Räumen oder mit einem Fest über zwei Tage? Dafür gibt es unser Schwesterprodukt social-wall.ch. EventShot ist auf Hochzeiten in üblicher Grösse ausgelegt.',
    },
  ],
  faq: [
    {
      question: 'Sollen wir die Gäste während der Trauung um Fotos bitten?',
      answer:
        'Nein. Bittet sie eher, die Handys für Zeremonie und Auszug liegen zu lassen. Danach darf wieder fotografiert werden, und der Apéro liefert ohnehin die lebendigeren Aufnahmen.',
    },
    {
      question: 'Wann sagen wir den Gästen, dass es eine Fotowand gibt?',
      answer:
        'Am besten zweimal: kurz beim Apéro und noch einmal nach dem Hauptgang. Eine einzige Ansage zu Beginn geht in der Ankunftsphase unter, weil zu diesem Zeitpunkt noch nicht alle im Raum sind.',
    },
    {
      question: 'Muss die Slideshow den ganzen Abend laufen?',
      answer:
        'Nein. Behandelt sie wie einen Programmpunkt: an beim Apéro, in der Essenspause und am späten Abend, aus während Trauung, Ansprachen und Eröffnungstanz, wenn die Fläche im Blickfeld der Gäste liegt.',
    },
    {
      question: 'Ersetzen Gästefotos den Fotografen?',
      answer:
        'Nein. Sie ergänzen ihn um Blickwinkel, die er nicht einnehmen kann, taugen aber nicht als Dokumentation des Tages. Plant beides nebeneinander statt das eine anstelle des anderen.',
    },
  ],
  related: [
    {
      title: 'Live-Fotowand für die Hochzeit',
      href: '/hochzeit',
    },
    {
      title: 'Die Live-Slideshow auf Beamer oder TV',
      href: '/live-slideshow',
    },
    {
      title: 'Beamer oder TV für die Slideshow?',
      href: '/ratgeber/beamer-oder-tv-slideshow',
    },
    {
      title: 'QR-Code-Tischkarten gestalten',
      href: '/ratgeber/qr-code-tischkarten-gestalten',
    },
  ],
  ctaTitle: 'Der Ablauf steht – fehlt die Fotowand',
  ctaText:
    'Legt euer Hochzeits-Event an, verteilt den QR-Code im Saal und lasst die Bilder eurer Gäste noch am selben Abend über die Leinwand laufen.',
}

export default function HochzeitFotoprogrammPlanenPage() {
  return <ArticlePage content={content} />
}
