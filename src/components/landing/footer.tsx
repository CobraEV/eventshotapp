'use client'

import { FadeIn } from '@/components/ui/motion'
import {
  Camera,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
} from 'lucide-react'
import Link from 'next/link'
import FooterNav from './footer-nav'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/80 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Camera className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">EventShot</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Wir revolutionieren die Eventfotografie mit interaktiven
              Live-Displays.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/eventshot.ch"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              {/* <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a> */}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <FooterNav />
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <div className="space-y-2 mb-4">
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@eventshot.ch
              </p>
            </div>
            <Link
              href="mailto:info@eventshot.ch"
              className="text-primary font-medium hover:underline"
            >
              Kontaktiere uns
            </Link>
          </div>
        </div>

        <FadeIn>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground space-y-2">
            <p>&copy; {currentYear} EventShot. Alle Rechte vorbehalten.</p>

            <p>
              EventShot ist ein Produkt von{' '}
              <a
                href="https://edelbyte.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                EdelByte – IT mit Leidenschaft
              </a>
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/agb" className="hover:underline text-primary">
                AGB
              </Link>
              <Link
                href="/datenschutz"
                className="hover:underline text-primary"
              >
                Datenschutz
              </Link>
              <Link href="/impressum" className="hover:underline text-primary">
                Impressum
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
