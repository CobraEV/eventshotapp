import Image from 'next/image'
import { FadeIn, StaggerContainer, StaggerItem } from '../ui/motion'
import HeroButtons from './hero-buttons'
import HeroContainer from './hero-container'

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
                Verwandle deine Veranstaltung in ein interaktives Erlebnis mit
                einer Live-Fotowand, auf der Gäste Fotos in Echtzeit hochladen
                und teilen können.
              </p>
            </StaggerItem>
            <StaggerItem>
              <HeroButtons />
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
