'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { destroyLenis, initLenis, scrollToTopInstant } from '@/lib/lenis'

export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    initLenis()
    return () => {
      destroyLenis()
    }
  }, [])

  // Lenis verwaltet die Scroll-Position selbst und uebersteuert damit das
  // Scroll-Reset, das Next.js bei einer Navigation macht. Ohne diesen Effekt
  // startet jede neue Seite an der Scroll-Position der vorherigen.
  useEffect(() => {
    scrollToTopInstant()
  }, [pathname])

  return null
}
