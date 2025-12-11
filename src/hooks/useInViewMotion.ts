'use client'

import { useEffect, useState, useRef } from 'react'

export function useInViewMotion<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect() // nur einmal triggern
      }
    }, options || { threshold: 0.1, rootMargin: '0px 0px -10% 0px' })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
}
