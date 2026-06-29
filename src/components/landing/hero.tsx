import { ServerIcon, ShieldCheckIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import { FadeIn, StaggerContainer, StaggerItem } from '../ui/motion'
import HeroButtons from './hero-buttons'
import HeroContainer from './hero-container'

const TRUST = [
  { icon: ServerIcon, label: 'Schweizer Hosting' },
  { icon: ShieldCheckIcon, label: 'DSG-konform' },
  { icon: Trash2Icon, label: 'Automatische Löschung' },
  { icon: ServerIcon, label: 'Kein Drittanbieter' },
]

export function Hero() {
  return (
    <section className="relative h-[calc(100svh-64px)] pt-48 sm:pt-0 flex items-center justify-center overflow-hidden">
      <HeroContainer>
        <Image
          src="/hero-bg.jpeg"
          alt="Eventshot Hero"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.3]"
          priority
        />
      </HeroContainer>

      <div className="container relative z-10">
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <StaggerItem>
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6">
                Erlebe <span className="text-primary">Momente</span>,
                <br />
                geteilt in <span className="text-primary">Echtzeit</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Die Live-Fotowand & Slideshow für eure Hochzeit, den Geburtstag
                und private Feiern: Gäste laden Fotos per QR-Code hoch – ganz
                ohne App – und sehen sie live als elegante Slideshow. Danach
                bleibt euch die digitale Galerie als Erinnerung.
              </p>
            </StaggerItem>
            <StaggerItem>
              <HeroButtons />
            </StaggerItem>
            <StaggerItem>
              <ul className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-white/70">
                {TRUST.map((item) => (
                  <li key={item.label} className="flex items-center gap-1.5">
                    <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </div>

          <FadeIn className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/eventshot-how-to.png"
              alt="EventShot Vorschau"
              fill
              className="object-cover"
              priority
            />
          </FadeIn>
        </StaggerContainer>
      </div>
    </section>
  )
}
