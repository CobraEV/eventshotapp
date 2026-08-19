// lib/lenis.ts
import type { MotionValue } from 'framer-motion'
import Lenis from 'lenis'

let lenis: Lenis | null = null
let rafId: number | null = null

export const initLenis = (scrollMV?: MotionValue<number>) => {
  if (lenis) return lenis

  lenis = new Lenis({
    lerp: 0.08, // smoothness (0-1 – kleiner = weicher)
    wheelMultiplier: 1,
    smoothWheel: true,
    orientation: 'vertical',
  })

  const raf = (time: number) => {
    lenis?.raf(time)
    // 1x pro Frame Synchro mit Framer Motion
    if (scrollMV && lenis) scrollMV.set(lenis.scroll)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  return lenis
}

/**
 * Muss die Modulvariable zuruecksetzen: sonst liefert ein spaeteres
 * initLenis() die bereits zerstoerte Instanz zurueck und das Scrollen
 * bleibt tot (z. B. nach einem Abstecher in den Auth-Bereich).
 */
export const destroyLenis = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  lenis?.destroy()
  lenis = null
}

/** Sprung an den Seitenanfang ohne Animation – fuer Routenwechsel. */
export const scrollToTopInstant = () => {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true })
  } else {
    window.scrollTo(0, 0)
  }
}
