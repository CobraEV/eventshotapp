import { Button } from "@/components/ui/button";
import { FadeInUp, ScrollReveal } from "@/components/ui/motion";
import CtaBg from "./cta-bg";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-16 relative overflow-hidden bg-muted/30">
      {/* Animated background bubbles */}
      <CtaBg />

      <div className="container relative z-10">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-secondary" />

            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bereit, dein nächstes Event zu transformieren?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Erschaffe unvergessliche Momente mit EventShots interaktiver
                Foto-Plattform. Starte noch heute und erlebe den Unterschied bei
                deinem nächsten Event.
              </p>
            </div>

            <FadeInUp className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base" asChild>
                <Link href={`mailto:info@eventshot.ch`}>Kostenlos starten</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href={`mailto:info@eventshot.ch`}>Demo vereinbaren</Link>
              </Button>
            </FadeInUp>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Keine Kreditkarte für die Testversion erforderlich. Jederzeit
              kündbar.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
