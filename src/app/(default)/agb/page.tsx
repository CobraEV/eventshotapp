import Link from "next/link";

export default function AGBPage() {
  return (
    <div className="container max-w-3xl py-16 space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="text-muted-foreground">
          Stand: Juni 2025 – gültig für alle kostenpflichtigen Leistungen auf{" "}
          <span className="text-primary">eventshot.ch</span>
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          1. Geltungsbereich
        </h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge
          und Leistungen im Zusammenhang mit der Nutzung von EventShot,
          insbesondere für Buchungen kostenpflichtiger Pläne. Mit
          Vertragsabschluss stimmen Kund:innen diesen Bedingungen zu.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          2. Leistungsumfang
        </h2>
        <p>
          EventShot bietet Eventfotodienste über eine individuelle Subdomain (
          <em>z. B. deinname.eventshot.ch</em>) an. Die Leistungen umfassen
          Upload-Möglichkeiten für Gäste, eine Live-Galerie und eine
          Download-Option nach dem Event. Der konkrete Leistungsumfang ergibt
          sich aus dem gebuchten Plan.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          3. Vertragsschluss & Zahlung
        </h2>
        <p>
          Mit Auswahl eines Plans und Abschluss des Buchungsprozesses auf der
          Plattform kommt ein rechtsgültiger Vertrag zustande. Die Zahlung
          erfolgt per Kreditkarte oder Twint über den eingebundenen
          Zahlungsanbieter. Ein Anspruch auf Rückerstattung besteht nicht, außer
          bei gesetzlich zwingenden Gründen (z. B. Widerruf).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          4. Nutzung & Pflichten
        </h2>
        <ul className="list-disc ps-6 space-y-1">
          <li>
            Die Subdomain darf keine Markenrechte oder Persönlichkeitsrechte
            verletzen.
          </li>
          <li>
            Es dürfen nur Inhalte hochgeladen werden, zu denen der/die
            Veranstalter:in die Rechte besitzt.
          </li>
          <li>
            EventShot übernimmt keine redaktionelle Kontrolle über Inhalte,
            behält sich jedoch die Löschung unzulässiger Medien vor.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">5. Datenschutz</h2>
        <p>
          Personenbezogene Daten und hochgeladene Fotos werden ausschliesslich
          zur Durchführung des Events gespeichert und automatisch 7 Tage nach
          Ende des gebuchten Zeitraums gelöscht. Weitere Details siehe{" "}
          <Link
            href="/datenschutz"
            className="underline text-primary hover:opacity-80"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          6. Haftung & Verfügbarkeit
        </h2>
        <p>
          EventShot haftet nicht für Ausfälle durch höhere Gewalt, technische
          Störungen oder unzulässige Nutzung durch Dritte. Die Verfügbarkeit der
          Plattform wird mit größtmöglicher Sorgfalt gewährleistet, ein 100%iger
          Anspruch auf permanente Erreichbarkeit besteht nicht.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          7. Laufzeit & Kündigung
        </h2>
        <p>
          Die Vertragslaufzeit richtet sich nach dem gewählten Plan. Eine
          automatische Verlängerung findet nicht statt. Vor Ablauf erhalten
          Kund:innen eine Erinnerungs-E-Mail zur optionalen Verlängerung.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          8. Gerichtsstand & Recht
        </h2>
        <p>
          Es gilt das Recht der Schweiz. Gerichtsstand für Streitigkeiten ist
          Winterthur.
        </p>
      </section>

      <div className="border-t pt-8 text-sm text-muted-foreground text-center">
        Fragen zu den AGB?{" "}
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
