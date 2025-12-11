'use client'

import { useCallback } from 'react'
import { Button } from '../ui/button'
import { initLenis } from '@/lib/lenis'

const HeroButtons = () => {
  const scrollTo = useCallback((target: string) => {
    initLenis().scrollTo(target, {
      offset: -60, // Sticky-Header ausgleichen
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    })
  }, [])

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <Button
        size="lg"
        className="text-base"
        onClick={() => scrollTo('#application')}
      >
        Jetzt starten
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="text-base"
        onClick={() => scrollTo('#gallery')}
      >
        Demo ansehen
      </Button>
    </div>
  )
}

export default HeroButtons
