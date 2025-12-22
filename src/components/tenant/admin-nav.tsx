'use client'

import { Button } from '@/components/ui/button'
import { adminRoutes } from '@/lib/admin/routes'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const AdminNav = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  /* -----------------------------
   * Sign out
   * ----------------------------- */
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push('/login'),
      },
    })
  }

  /* -----------------------------
   * Scroll lock + ESC
   * ----------------------------- */
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* =========================
       * Mobile Menu Button
       * ========================= */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      {/* =========================
       * Desktop Navigation
       * ========================= */}
      <nav className="hidden lg:flex items-center gap-2">
        {adminRoutes.map((route) => (
          <Link
            key={route.url}
            href={route.url}
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
              route.url === pathname
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <route.icon className="h-4 w-4 text-primary" />
            {route.label}
          </Link>
        ))}

        <Button variant="ghost" onClick={handleSignOut}>
          <LogOut className="mr-1 h-4 w-4 text-primary" />
          Abmelden
        </Button>
      </nav>

      {/* =========================
       * Mobile Fullscreen Overlay
       * ========================= */}
      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-9999 bg-background"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <span className="text-lg font-bold">Admin</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                  >
                    <X />
                  </Button>
                </div>

                {/* Navigation */}
                <motion.nav
                  className="flex flex-col gap-6 p-6"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                >
                  {adminRoutes.map((route) => (
                    <motion.div
                      key={route.url}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link
                        href={route.url}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-3 text-2xl font-bold transition-colors',
                          route.url === pathname
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                        )}
                      >
                        <route.icon className="h-6 w-6" />
                        {route.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Sign out */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Button
                      variant="outline"
                      className="mt-8 w-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-primary" />
                      Abmelden
                    </Button>
                  </motion.div>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}

export default AdminNav
