'use client'

import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/constants'
import { initLenis } from '@/lib/lenis'
import { cn } from '@/lib/utils'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Camera, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  const pathname = usePathname()
  const router = useRouter()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 10)
  })

  // Schließe das mobile Menü beim Klick außerhalb
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  const handleSmoothScroll = async (
    e: React.MouseEvent<HTMLElement>,
    href: string
  ) => {
    if (!href.startsWith('#')) return

    e.preventDefault()

    if (pathname !== '/') {
      // Navigiere zu `/` mit Hash
      router.push(`/${href}`)
      return
    }

    const lenis = initLenis()
    lenis.scrollTo(href, {
      offset: -60,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })

    setIsOpen(false)
  }

  return (
    <div>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-20 py-4 transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">EventShot</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Desktop-Navigation */}
            <nav className="hidden lg:flex items-center gap-4">
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Button
                size="sm"
                onClick={(e) => handleSmoothScroll(e, '#application')}
              >
                Jetzt starten
              </Button>
            </nav>

            <Button
              variant={'outline'}
              className="lg:hidden border-primary!"
              onClick={(e) => handleSmoothScroll(e, '#application')}
            >
              Jetzt starten
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="lg:hidden w-9 h-9 z-40"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
            >
              {isOpen ? <X size={30} /> : <Menu className="w-32" size={30} />}
            </Button>
          </div>
        </div>
      </motion.header>
      {/* Mobile Navigation */}

      {isOpen && (
        <motion.div
          key="mobile-menu"
          className={cn(
            'fixed top-0 left-0 w-full h-full z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-lg lg:hidden'
          )}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.nav
            className="flex flex-col items-start gap-6 text-lg font-medium"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {siteConfig.navItems.map((item) => (
              <motion.div
                key={item.href}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="hover:text-primary text-4xl font-bold transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              className="flex-1 w-full"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Button
                size="lg"
                className="mt-4 w-full"
                onClick={(e) => handleSmoothScroll(e, '#application')}
              >
                Jetzt starten
              </Button>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </div>
  )
}
