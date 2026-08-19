import type { Metadata } from 'next'
import {
  type ArticleContent,
  ArticlePage,
} from '@/components/landing/article-page'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  path: '/ratgeber/beamer-oder-tv-slideshow',
  title: 'Beamer oder TV für die Foto-Slideshow?',
  description:
    'Auflösung, Helligkeit, Platzierung im Saal und WLAN: die Technik-Checkliste für die Live-Slideshow am Fest – inklusive Plan B.',
})

const content: ArticleContent = {
  eyebrow: 'Ratgeber',
  title: 'Beamer oder TV für die Slideshow?',
  lead: 'Für die meisten Feste ist ein grosser Fernseher die verlässlichere Wahl, weil er auch bei eingeschaltetem Saallicht lesbar bleibt. Ein Beamer lohnt sich dann, wenn der Raum abdunkelbar ist und die Bilder wirklich gross wirken sollen.',
  path: '/ratgeber/beamer-oder-tv-slideshow',
  datePublished: '2026-08-19',
  readingMinutes: 7,
  blocks: [
    {
      type: 'paragraph',
      text: 'Die Frage klingt nach einer Geschmacksfrage, ist aber eine Lichtfrage. Wer sie im Techniktermin mit dem Lokal in fünf Minuten klärt, spart sich am Festabend die Diskussion darüber, warum die Leinwand aussieht wie ein grauer Vorhang. Der Reihe nach: was den Unterschied macht, wo die Fläche hingehört, was mit dem Internet zusammenhängt und was ihr tut, wenn nichts davon funktioniert.',
    },
    { type: 'heading', text: 'Licht entscheidet, nicht die Bildschirmgrösse' },
    {
      type: 'paragraph',
      text: 'Ein Fernseher leuchtet selbst. Ein Beamer wirft Licht auf eine Fläche und konkurriert dabei mit allem anderen im Raum: mit Deckenspots, Kerzen und der Fensterfront an einem langen Sommerabend. Derselbe Beamer, der um 23 Uhr im dunklen Saal beeindruckt, wirkt beim Apéro um 18 Uhr blass und flau.',
    },
    {
      type: 'paragraph',
      text: 'Daraus folgt eine einfache Regel. Soll die Anzeige über den ganzen Anlass mitlaufen, vom Apéro bis nach dem Dessert, nehmt den Fernseher. Soll sie ein eigener Moment sein, etwa zum Kaffee bei gedimmtem Licht, spielt der Beamer seine Grösse aus. Fragt beim Lokal oder beim Verleih nach der Helligkeit des Geräts in Lumen und danach, ob es in genau diesem Saal schon im Einsatz war – eine Zahl aus dem Datenblatt und eine Erfahrung vor Ort sagen mehr als die Zusage, das Gerät sei hell.',
    },
    { type: 'heading', text: 'Wo die Fläche im Saal steht' },
    {
      type: 'paragraph',
      text: 'Über den Erfolg entscheidet die Platzierung häufiger als die Technik. Fünf Punkte, die sich bewährt haben:',
    },
    {
      type: 'list',
      items: [
        'Von den Tischen aus sichtbar, aber nicht hinter dem Ehrentisch – sonst dreht sich der halbe Saal weg',
        'Höher als Kopfhöhe aufhängen oder aufstellen, damit stehende Gäste niemandem die Sicht nehmen',
        'Nicht direkt neben Tanzfläche und Lautsprechern, wo Kabel und Gerät im Weg stehen',
        'Beim Beamer eine freie Projektionsstrecke wählen, durch die niemand ständig hindurchläuft',
        'Kabel der Wand entlang führen und abkleben, statt sie quer durch den Raum zu ziehen',
      ],
    },
    { type: 'heading', text: 'Auflösung, Format und was Handyfotos brauchen' },
    {
      type: 'paragraph',
      text: 'Die Quelle sind Aufnahmen aus Hosentaschen, und die stehen meistens hochkant. Auf einer Fläche im Querformat erscheinen sie deshalb mit Rändern links und rechts. Das ist kein Fehler, sondern der ehrliche Umgang mit dem Ausgangsmaterial: Ein automatischer Zuschnitt auf Vollbild würde regelmässig Köpfe kosten. Klärt vorab, ob eure Anzeige Hochformat vollständig darstellt oder beschneidet.',
    },
    {
      type: 'paragraph',
      text: 'Bei der Auflösung genügt Full HD in fast allen Fällen. Ein Foto vom Handy, das über eine Internetverbindung geladen wird, gewinnt auf einer feineren Fläche kaum sichtbar dazu. Wichtiger als die Pixelzahl sind ein sauberer HDMI-Anschluss, ein Gerät, das nicht mitten am Abend in den Ruhezustand fällt, und eine Fläche ohne Falten oder Muster im Untergrund.',
    },
    { type: 'heading', text: 'Der eigentliche Knackpunkt ist die Verbindung' },
    {
      type: 'paragraph',
      text: 'Zwei Verbindungen müssen halten. Erstens die des Anzeigegeräts, das laufend neue Bilder nachlädt. Zweitens die eurer Gäste dort, wo sie fotografieren. Im Gewölbekeller, in der Scheune und hinter dicken Altbaumauern ist Empfang keine Selbstverständlichkeit, und ausgerechnet dort stehen die schönsten Säle.',
    },
    {
      type: 'paragraph',
      text: 'Klärt vor dem Fest drei Dinge mit dem Lokal: ob es ein Gäste-WLAN gibt, wie das Passwort lautet und ob es auch trägt, wenn viele Personen gleichzeitig darin sind. Wo der Empfang schwach ist, hilft schon die Platzierung: Stellt den QR-Code dort auf, wo das Netz am besten ist, also eher beim Apéro-Tisch als im hintersten Saalteil. Und notiert das WLAN-Passwort gut lesbar direkt daneben.',
    },
    { type: 'heading', text: 'Die Checkliste für den Techniktermin' },
    {
      type: 'ordered',
      items: [
        'Fragt das Lokal, welche Technik im Haus ist: Fernseher, Beamer, Leinwand, Kabel, Fernbedienung – vieles ist vorhanden und muss gar nicht gemietet werden.',
        'Klärt, wer das Gerät ein- und ausschaltet und wo der Schlüssel zum Technikschrank liegt.',
        'Testet die Anzeige vor Ort zur selben Tageszeit, zu der sie später laufen soll, nicht am Vormittag mit geschlossenen Vorhängen.',
        'Schaltet Standby, Bildschirmschoner und Energiesparmodus am Anzeigegerät aus.',
        'Deaktiviert Benachrichtigungen auf dem Laptop, falls dieser das Bild liefert.',
        'Ruft die Anzeige im Vollbild auf und prüft, dass keine Bedienleiste und keine Adresszeile sichtbar bleibt.',
        'Packt Verlängerungskabel, Mehrfachsteckdose und den passenden HDMI-Adapter für euren Laptop ein.',
        'Bestimmt eine Person, die während des Abends ein Auge darauf hat – ausdrücklich nicht ihr beide.',
      ],
    },
    { type: 'heading', text: 'Plan B, den ihr vorher festlegt' },
    {
      type: 'paragraph',
      text: 'Technik fällt aus, meistens im ungünstigsten Moment. Die beruhigende Einsicht dabei: Es geht nichts verloren. Die Fotos eurer Gäste landen unabhängig von der Anzeige an ihrem Ziel, die Fläche im Saal ist nur der sichtbare Teil davon.',
    },
    {
      type: 'paragraph',
      text: 'Ein brauchbarer Plan B beantwortet drei Fragen. Wer schaut nach, wenn das Bild schwarz bleibt? Welches Ersatzgerät steht bereit, ein zweiter Fernseher im Nebenraum oder notfalls ein Laptop auf dem Sideboard? Und wenn gar nichts geht: weitersammeln, nichts ansagen, die Bilder am Tag danach gemeinsam anschauen. Niemand vermisst eine Leinwand, von der er nichts wusste.',
    },
    { type: 'heading', text: 'Was die Slideshow von EventShot vom Saal braucht' },
    {
      type: 'paragraph',
      text: 'Die Live-Slideshow läuft als gewöhnliche Webseite im Vollbild. Es braucht also kein Programm auf einem Rechner, sondern ein Gerät mit Browser und Internetzugang am Beamer oder am Fernseher: einen Laptop, einen kleinen Stick am HDMI-Anschluss oder den Browser eines Smart-TVs. Hochformat-Bilder werden dabei vollständig gezeigt und nicht beschnitten.',
    },
    {
      type: 'paragraph',
      text: 'Wie lange ein Bild stehen bleibt, ist ab Premium zu CHF 99.- pro Event einstellbar; dort lässt sich auch die Slideshow-Steuerung ein- und ausblenden, sodass auf der Fläche nur noch das Foto zu sehen ist. Basic zu CHF 49.- pro Event zeigt die Slideshow mit den Standardwerten, was für einen Fernseher beim Apéro in aller Regel genügt.',
    },
    {
      type: 'note',
      text: 'Fragt zuerst im Lokal nach, bevor ihr Technik mietet. Viele Restaurants und Säle haben Beamer, Leinwand oder einen grossen Fernseher im Haus, oft gegen eine kleine Pauschale und mit jemandem, der die Anschlüsse kennt. Das ist meist günstiger und immer weniger Aufwand als eine eigene Anlieferung am Festtag.',
    },
  ],
  faq: [
    {
      question: 'Brauchen wir einen Laptop für die Slideshow?',
      answer:
        'Nein. Es genügt ein Gerät mit Browser und Internetzugang am Bildschirm. Ein Laptop oder ein Stick am HDMI-Anschluss ist allerdings verlässlicher als der eingebaute Browser eines Fernsehers, der je nach Modell träge reagiert.',
    },
    {
      question: 'Läuft die Slideshow ohne Internet im Saal?',
      answer:
        'Nein. Das Anzeigegerät lädt die Bilder laufend nach und braucht dafür eine Verbindung. Wo kein WLAN liegt, hilft ein Mobilfunk-Hotspot an einer Stelle mit gutem Empfang, idealerweise am Fenster statt im Kellergewölbe.',
    },
    {
      question: 'Können wir die Anzeige während der Reden unterbrechen?',
      answer:
        'Ja. Schaltet den Beamer oder den Fernseher einfach aus. Die Fotos gehen dabei nicht verloren, sie erscheinen wieder, sobald das Gerät läuft.',
    },
    {
      question: 'Werden Hochformat-Fotos beschnitten?',
      answer:
        'Nein. Jedes Bild wird vollständig angezeigt, bei Hochformat bleiben links und rechts Ränder frei. Das ist bei Handyfotos normal und deutlich besser als ein Zuschnitt, der Köpfe abschneidet.',
    },
  ],
  related: [
    { title: 'Live-Slideshow für Beamer und TV', href: '/live-slideshow' },
    { title: 'QR-Code-Vorlagen zum Ausdrucken', href: '/qr-code-vorlagen' },
    { title: 'Alle Funktionen im Überblick', href: '/funktionen' },
    { title: 'Fotowand für eure Hochzeit', href: '/hochzeit' },
  ],
  ctaTitle: 'Bereit für die Slideshow an eurem Fest?',
  ctaText:
    'Richtet euer Event in wenigen Minuten ein und ruft die Slideshow auf dem Gerät am Beamer oder am Fernseher auf. Das Anlegen kostet nichts, gezahlt wird einmalig pro Event.',
}

export default function BeamerOderTvSlideshowPage() {
  return <ArticlePage content={content} />
}
