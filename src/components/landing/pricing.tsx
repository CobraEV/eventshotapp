import { ScrollReveal } from '@/components/ui/motion'
import { pricingPlans } from '@/lib/constants'
import { Check } from 'lucide-react'
export function Pricing() {
  return (
    <section id="pricing" className="py-16 bg-muted/30">
      <div className="container">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Einfach & transparent
            </h2>
            <p className="text-muted-foreground text-lg">
              Wähle das passende Paket für dein Event – ohne versteckte Kosten
              oder Überraschungen.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card rounded-xl overflow-hidden h-full border ${
                plan.highlighted
                  ? 'border-primary shadow-lg relative'
                  : 'border-border shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-b-lg font-medium text-sm">
                  Meistgewählt
                </div>
              )}

              <div
                className={`p-6 flex flex-col h-full ${
                  plan.highlighted ? 'pt-10' : ''
                }`}
              >
                <div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">
                      {plan.duration}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-muted-foreground">
          <p>
            Du brauchst eine individuelle Lösung?{' '}
            <a
              href="mailto:info@eventshot.ch"
              className="text-primary underline underline-offset-4"
            >
              Kontaktiere uns
            </a>{' '}
            für ein massgeschneidertes Angebot.
          </p>
        </div>
      </div>
    </section>
  )
}
