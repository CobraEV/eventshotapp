import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/ui/motion'
import { howItWorks } from '@/lib/constants'
import Image from 'next/image'
import HowItWorksBg from './how-it-works-bg'
import { Separator } from '../ui/separator'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 relative overflow-hidden">
      {/* Dekorative Hintergründe */}
      <HowItWorksBg />

      <div className="container">
        {/* Überschrift + Copy einmalig einblenden */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              So funktioniert EventShot
            </h2>
            <p className="text-muted-foreground text-lg">
              In nur wenigen Minuten startklar – so einfach ist unser Ablauf für
              das Teilen von Eventfotos.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="order-2 lg:order-1">
            <StaggerContainer className="space-y-4">
              {howItWorks.map((step) => (
                <StaggerItem key={step.step}>
                  <div className="flex gap-4">
                    {/* <div className="shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl text-white">
                      {step.step}
                    </div> */}
                    <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center p-4 font-bold text-sm text-white">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {howItWorks.length > step.step && (
                    <Separator className="mt-4" />
                  )}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Bild */}
          <div className="order-1 lg:order-2">
            <ScrollReveal className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/eventshot-hero.png"
                alt="Personen mit Smartphones bei einem Event"
                fill
                className="object-cover"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
