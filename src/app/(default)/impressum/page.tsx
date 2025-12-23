import Link from 'next/link'

export default function ImpressumPage() {
  return (
    <div className="container max-w-3xl py-16 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Impressum</h1>
        <p className="text-muted-foreground">Angaben gemäss Schweizer Recht</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">Anbieter</h2>
        <p>
          <strong>EdelByte – IT mit Leidenschaft</strong>
          <br />
          Zihlackerring 6
          <br />
          8488 Turbenthal
          <br />
          Schweiz
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          Unternehmensangaben
        </h2>
        <p>
          Rechtsform: Einzelunternehmen
          <br />
          UID / MWST-Nr.: <strong>CHE-365.373.264</strong>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">Inhaber</h2>
        <p>Endrit Veliji</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">Kontakt</h2>
        <p>
          E-Mail:{' '}
          <Link
            href="mailto:info@edelbyte.ch"
            className="text-primary underline hover:opacity-80"
          >
            info@edelbyte.ch
          </Link>
          <br />
          Website:{' '}
          <a
            href="https://edelbyte.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-80"
          >
            https://edelbyte.ch
          </a>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">Hinweis</h2>
        <p>
          EventShot ist ein Produkt der EdelByte – IT mit Leidenschaft. Für
          Inhalte externer Links wird keine Haftung übernommen.
        </p>
      </section>

      <div className="border-t pt-8 text-sm text-muted-foreground text-center">
        Bei rechtlichen Fragen erreichst du uns unter{' '}
        <Link
          href="mailto:info@edelbyte.ch"
          className="text-primary underline hover:opacity-80"
        >
          info@edelbyte.ch
        </Link>
      </div>
    </div>
  )
}
