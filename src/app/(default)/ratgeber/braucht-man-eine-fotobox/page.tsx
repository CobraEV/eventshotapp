import type { Metadata } from 'next'
import {
  type ArticleContent,
  ArticlePage,
} from '@/components/landing/article-page'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  path: '/ratgeber/braucht-man-eine-fotobox',
  title: 'Braucht man an der Hochzeit eine Fotobox?',
  description:
    'Entscheidungshilfe: Wann sich eine Mietfotobox lohnt, wann eine digitale Fotowand reicht und wann ihr ganz darauf verzichten könnt.',
})

const content: ArticleContent = {
  eyebrow: 'Ratgeber',
  title: 'Braucht ihr an eurer Hochzeit eine Fotobox?',
  lead: 'Nein, zwingend braucht ihr keine. Eine Mietfotobox lohnt sich, wenn ihr gedruckte Bilder in der Hand halten wollt und der Abend einen betreuten Programmpunkt verträgt – geht es euch dagegen um alle Bilder des Festes, reicht eine digitale Lösung, und im kleinen Kreis könnt ihr auch ganz darauf verzichten.',
  path: '/ratgeber/braucht-man-eine-fotobox',
  datePublished: '2026-08-19',
  readingMinutes: 7,
  blocks: [
    {
      type: 'paragraph',
      text: 'Kabine, Blitzlicht, Requisitenkiste und ein Stapel Fotostreifen: Die Fotobox steht auf fast jeder Hochzeitscheckliste, meistens ohne dass jemand fragt, was sie eigentlich leisten soll. Dieser Text dreht die Frage deshalb um. Nicht «welche Fotobox», sondern «wofür» – und am Ende steht eine Entscheidung, die zu eurem Saal, eurem Programm und eurem Budget passt.',
    },
    { type: 'heading', text: 'Was eine Fotobox tatsächlich leistet' },
    {
      type: 'paragraph',
      text: 'Eine Mietfotobox ist ein fester Ort mit einer festen Aufgabe. Sie liefert gestellte Aufnahmen bei gleichbleibendem Licht, auf Knopfdruck und in Serie, und bei den meisten Anbietern kommt der Streifen sofort aus dem Drucker. Genau dieser Ausdruck ist der Kern des Angebots: etwas Gedrucktes, das eure Gäste mitnehmen oder in ein Gästebuch kleben.',
    },
    {
      type: 'paragraph',
      text: 'Ebenso wichtig ist, was sie nicht leistet. Vor der Linse landet nur, wer sich davorstellt. Das Gespräch am Apéro, die Grossmutter beim Anschneiden der Torte, der erste Tanz von der Seite gesehen: All das entsteht anderswo im Saal und bleibt danach auf den Handys eurer Gäste liegen. Weil sich zudem immer nur eine Gruppe gleichzeitig ablichten lässt, bildet sich in den Stosszeiten eine Warteschlange – und die meiden erfahrungsgemäss genau die Gäste, die ohnehin zurückhaltend sind.',
    },
    { type: 'heading', text: 'Vier Fragen, die euch die Entscheidung abnehmen' },
    {
      type: 'ordered',
      items: [
        'Wollt ihr etwas Gedrucktes? Wenn am Ende des Abends Papierstreifen im Gästebuch kleben sollen, führt kein Weg an einem Gerät mit Drucker vorbei. Weder ein Bildschirm noch eine Galerie ersetzt das.',
        'Braucht euer Abend einen zusätzlichen Programmpunkt? Zwischen Dessert und Tanz entsteht oft eine Lücke, und eine betreute Station mit Requisiten füllt sie zuverlässig. Ist euer Programm mit Reden, Spielen und Musik ohnehin dicht, konkurriert die Kabine damit.',
        'Wollt ihr gestellte Porträts oder den ganzen Abend aus Gästesicht? Das ist der Unterschied zwischen einer Serie schöner Posen und hunderten Momenten, die niemand geplant hat. Beides ist eine berechtigte Erwartung, aber es sind zwei verschiedene Wünsche.',
        'Was gibt euer Saal her? Fragt vor der Buchung nach freier Fläche, Steckdose und Deckenhöhe. In einem kleinen Restaurant ist die Kabine schnell das grösste Möbel im Raum, und der Platz fehlt dann woanders.',
      ],
    },
    { type: 'heading', text: 'Wann sich eine Mietfotobox lohnt' },
    {
      type: 'paragraph',
      text: 'Es gibt Feste, an denen die Kabine ihr Geld wert ist. Meistens trifft dann mehr als einer dieser Punkte zu:',
    },
    {
      type: 'list',
      items: [
        'Ihr wollt gedruckte Fotos zum Mitnehmen oder für ein Gästebuch zum Einkleben',
        'Der Saal hat Platz, Strom und eine Ecke, die sonst leer bliebe',
        'Viele Gäste fotografieren selbst kaum, lassen sich aber gerne ablichten',
        'Hintergrund, Requisiten und Betreuung sind als eigener Programmpunkt gewollt',
        'Im Lokal gibt es weder ein brauchbares Gäste-WLAN noch verlässlichen Empfang',
        'Jemand aus eurem Kreis übernimmt Absprache, Aufbau und Rückgabe',
      ],
    },
    { type: 'heading', text: 'Wann eine digitale Fotowand reicht' },
    {
      type: 'paragraph',
      text: 'Die digitale Variante kehrt das Prinzip um: Nicht die Gäste kommen zur Kamera, sondern die Kamera steckt längst in jeder Tasche. Fotografiert wird über den ganzen Abend verteilt, hochgeladen wird per QR-Code, und die Bilder erscheinen kurz darauf auf Leinwand oder Fernseher. Das passt, wenn ihr euch hier wiederfindet:',
    },
    {
      type: 'list',
      items: [
        'Ihr wollt alle Bilder des Festes, nicht nur die vor einer Kabine',
        'Im Lokal ist kein Quadratmeter für Kabine und Drucker frei',
        'Viele Gäste sollen gleichzeitig beitragen können, ohne anzustehen',
        'Die Bilder dürfen schon während der Feier sichtbar sein',
        'Nach dem Fest sollen alle über denselben Weg an die Fotos kommen',
      ],
    },
    { type: 'heading', text: 'Wann ihr auf beides verzichten könnt' },
    {
      type: 'paragraph',
      text: 'Bei einer kleinen Feier im engsten Kreis, begleitet von einer Fotografin oder einem Fotografen über den ganzen Tag, braucht es weder Kabine noch Bildschirm. Eines solltet ihr trotzdem regeln: wohin die Bilder gehen, die eure Gäste ohnehin machen. Ohne Absprache bleiben sie in einzelnen Kamerarollen liegen, und drei Wochen später lauft ihr jedem Foto einzeln hinterher.',
    },
    {
      type: 'paragraph',
      text: 'Legt euch also mindestens auf einen gemeinsamen Weg fest und nennt ihn am Abend laut – einmal beim Apéro und einmal vor dem Dessert. Welcher Weg das ist, ist zweitrangig. Dass es nur einer ist, ist entscheidend.',
    },
    { type: 'heading', text: 'Rechnet mit der Endsumme, nicht mit dem Grundpreis' },
    {
      type: 'paragraph',
      text: 'Beim Vergleich lohnt sich Genauigkeit. Eine Offerte für eine Mietbox deckt üblicherweise eine feste Stundenzahl an einem festen Ort ab; Anfahrt, Auf- und Abbau, Betreuung, Verbrauchsmaterial und jede zusätzliche Stunde stehen oft daneben. Lasst euch die Offerte deshalb als Endsumme für eure tatsächliche Dauer geben und ausdrücklich schriftlich festhalten, was passiert, wenn die Feier länger dauert als geplant.',
    },
    {
      type: 'paragraph',
      text: 'Auf der anderen Seite fällt bei einer digitalen Lösung kein Verbrauchsmaterial an, dafür stellt sich eine andere Frage: Wie lange kommt ihr nach dem Fest noch an die Bilder? Diese Frist entscheidet darüber, wie viel Ruhe ihr beim Sichten und Herunterladen habt, und sie gehört in den Vergleich genauso hinein wie der Preis.',
    },
    { type: 'heading', text: 'Wie EventShot in diese Entscheidung passt' },
    {
      type: 'paragraph',
      text: 'EventShot ist die digitale Variante und kein Ersatz für einen Drucker. Eure Gäste scannen den QR-Code auf der Tischkarte, wählen ein Foto aus und laden es hoch, ganz ohne App und ohne Konto. Kurz darauf läuft das Bild in der Live-Slideshow auf Beamer oder TV mit, und nach dem Fest führt derselbe Code in die digitale Galerie. Bezahlt wird einmalig pro Event: CHF 49.- für Basic, CHF 99.- für Premium mit 30 Tagen Galerie, CHF 149.- für Enterprise.',
    },
    {
      type: 'paragraph',
      text: 'Was ihr dabei nicht bekommt, sagen wir offen: keine Fotostreifen aus dem Drucker, keine Requisitenkiste und niemanden, der den Abend über danebensteht. Wer genau das sucht, ist mit einer Mietbox besser bedient – und wer beides möchte, kombiniert die zwei Angebote.',
    },
    {
      type: 'note',
      text: 'Kombinieren ist verbreiteter, als viele denken: Die Kabine läuft zwei Stunden nach dem Essen, die digitale Fotowand vom Apéro bis zum letzten Tanz. Wer so plant, kann die Fotobox kürzer buchen, weil sich der Andrang verteilt.',
    },
  ],
  faq: [
    {
      question: 'Können wir eine Fotobox und eine digitale Fotowand kombinieren?',
      answer:
        'Ja. Die beiden stören sich nicht, weil sie unterschiedliche Bilder liefern: gestellte Aufnahmen an einem Ort und den restlichen Abend aus Gästesicht. Bucht die Kabine in diesem Fall für ein kürzeres Zeitfenster.',
    },
    {
      question: 'Brauchen wir eine Fotobox, wenn wir schon einen Fotografen haben?',
      answer:
        'Nein. Eine Fotografin oder ein Fotograf deckt Zeremonie, Porträts und Reportage ab. Die Fotobox liefert etwas anderes, nämlich Ausdrucke zum Mitnehmen. Wollt ihr die nicht, entfällt der Hauptgrund für die Buchung.',
    },
    {
      question: 'Lohnt sich eine Fotobox bei 40 Gästen?',
      answer:
        'Meistens nicht. In einer kleinen Runde ist die Kabine nach einer Stunde durchgespielt, bindet aber den ganzen Abend Platz und Budget. Umgekehrt kann sie genau richtig sein, wenn eure Runde klein ist und alle den Streifen als Andenken mitnehmen sollen.',
    },
    {
      question: 'Bekommen wir mit einer digitalen Fotowand auch gedruckte Bilder?',
      answer:
        'Nein. Die Aufnahmen bleiben digital und liegen nach dem Fest in der Galerie. Wer Ausdrucke möchte, wählt sie dort in Ruhe aus und gibt sie später bei einem Fotodienst in Auftrag – oft mit einem schöneren Ergebnis als ein Sofortdruck am Abend.',
    },
  ],
  related: [
    {
      title: 'Die Alternative zur Mietfotobox im Vergleich',
      href: '/fotobox-alternative',
    },
    {
      title: 'Fotobox-Kosten in der Schweiz im Detail',
      href: '/fotobox-kosten-schweiz',
    },
    { title: 'Digitale Fotobox: was der Begriff meint', href: '/digitale-fotobox' },
    { title: 'Fotowand für eure Hochzeit', href: '/hochzeit' },
  ],
  ctaTitle: 'Bereit für eure digitale Fotowand?',
  ctaText:
    'Ihr legt euer Hochzeits-Event in wenigen Minuten an, wählt den Plan und druckt die Codes für eure Tische. Registrieren kostet nichts, der Einmalpreis fällt erst beim Buchen an.',
}

export default function BrauchtManEineFotoboxPage() {
  return <ArticlePage content={content} />
}
