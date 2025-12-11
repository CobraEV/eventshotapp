import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="container max-w-3xl py-16 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Datenschutzerklärung
        </h1>
        <p className="text-muted-foreground">
          Gültig für alle Nutzer:innen von{" "}
          <span className="text-primary">eventshot.ch</span> – Stand: Juni 2025
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          1. Verantwortliche Stelle
        </h2>
        <p>
          Verantwortlich für die Datenverarbeitung ist:
          <br />
          EventShot
          <br />
          8488 Turbenthal, Schweiz
          <br />
          E-Mail:{" "}
          <Link
            href="mailto:info@eventshot.ch"
            className="text-primary underline hover:opacity-80"
          >
            info@eventshot.ch
          </Link>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          2. Erhobene Daten
        </h2>
        <p>
          Beim Besuch unserer Seiten oder bei Nutzung eines Event-Zugangs werden
          folgende Daten verarbeitet:
        </p>
        <ul className="list-disc ps-6 space-y-1">
          <li>Subdomain-Name und Planinformationen</li>
          <li>Vorname, Name, E-Mail-Adresse, Firmenname (sofern angegeben)</li>
          <li>Fotos, die Gäste freiwillig hochladen</li>
          <li>Meta- und Nutzungsdaten (Browsertyp, IP-Adresse, Zeitpunkt)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          3. Zweck der Datenverarbeitung
        </h2>
        <p>
          Die Datenverarbeitung dient ausschließlich dem Betrieb und der
          Abwicklung deines Event-Zugangs. Eine Weitergabe an Dritte erfolgt
          nicht. Fotos sind öffentlich im Rahmen der jeweiligen Subdomain
          sichtbar und werden nach Ablauf des Events automatisch gelöscht.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          4. Speicherfristen
        </h2>
        <p>
          Alle gespeicherten Inhalte (Bilder, Subdomain-Daten) werden
          automatisch <strong>7 Tage</strong> nach Event-Ende gelöscht.
          Zahlungsdaten werden gemäß gesetzlichen Vorgaben{" "}
          <strong>10 Jahre</strong> aufbewahrt.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">5. Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung oder
          Einschränkung der Verarbeitung deiner personenbezogenen Daten. Ebenso
          kannst du der Verarbeitung widersprechen oder deine Einwilligung
          jederzeit widerrufen.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          6. Änderungen dieser Erklärung
        </h2>
        <p>
          Diese Datenschutzerklärung kann jederzeit angepasst werden. Es gilt
          jeweils die auf{" "}
          <Link href="/" className="text-primary underline hover:opacity-80">
            eventshot.ch
          </Link>{" "}
          veröffentlichte Version.
        </p>
      </section>

      <div className="border-t pt-8 text-sm text-muted-foreground text-center">
        Fragen zum Datenschutz?{" "}
        <Link
          href="mailto:info@eventshot.ch"
          className="text-primary underline hover:opacity-80"
        >
          Kontaktiere uns
        </Link>
      </div>
    </div>
  );
}
