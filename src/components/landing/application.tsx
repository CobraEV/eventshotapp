import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ui/motion'
import { ArrowRight, CheckCircle, LogInIcon, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export function Application() {
  return (
    <section
      id="application"
      className="py-16 bg-linear-to-br from-primary/5 via-background to-secondary/5 border-b"
    >
      <div className="container">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für dein Event?
            </h2>
            <p className="text-muted-foreground text-lg">
              Registriere dich jetzt und erstelle dein Event in wenigen Minuten.
              Einfach, schnell und ohne komplizierte Einrichtung.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-border shadow-lg">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="h-10 w-10 text-primary" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Jetzt registrieren und loslegen
              </h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Erstelle dein Konto und richte dein erstes Event in wenigen
                Minuten ein. Keine Kreditkarte erforderlich für den Start.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="text-base group" asChild>
                  <Link href="/register">
                    Jetzt registrieren
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="text-base"
                  asChild
                >
                  <Link href="/login">
                    <LogInIcon />
                    Anmleden
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Kostenloser Start • Keine versteckten Gebühren • Jederzeit
                kündbar
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Benefits section */}
        <div className="mt-16">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-4">Warum EventShot?</h3>
              <p className="text-muted-foreground text-lg">
                Über 500+ zufriedene Kunden vertrauen bereits auf unsere
                Plattform
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold mb-2">Sofort einsatzbereit</h4>
                <p className="text-muted-foreground text-sm">
                  Dein Event ist in weniger als 5 Minuten eingerichtet und
                  einsatzbereit
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold mb-2">Keine App nötig</h4>
                <p className="text-muted-foreground text-sm">
                  Deine Gäste scannen einfach den QR-Code und können sofort
                  loslegen
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold mb-2">Live-Erlebnis</h4>
                <p className="text-muted-foreground text-sm">
                  Fotos erscheinen sofort auf dem Bildschirm und schaffen
                  einzigartige Momente
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
