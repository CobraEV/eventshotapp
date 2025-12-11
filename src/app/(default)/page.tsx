import { Application } from '@/components/landing/application'
import { CTA } from '@/components/landing/cta'
import { FAQ } from '@/components/landing/faq'
import { Features } from '@/components/landing/features'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Pricing } from '@/components/landing/pricing'
import { Testimonials } from '@/components/landing/testimonials'
import { Video } from '@/components/landing/video'

export default async function HomePage() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Video />
      <Testimonials />
      <Pricing />
      <Application />
      <FAQ />
      <CTA />
    </div>
  )
}
