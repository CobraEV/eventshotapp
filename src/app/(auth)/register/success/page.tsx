'use client'

import { MailIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-muted/30 to-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-background/80 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <MailIcon className="h-6 w-6 text-primary" />
        </div>

        <h1 className="text-center text-2xl font-bold tracking-tight">
          Registrierung erfolgreich
        </h1>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          Wir haben dir eine E-Mail zur Bestätigung geschickt.
          <br />
          <strong>Bitte prüfe dein Postfach</strong> und bestätige deine
          Registrierung, um dein Konto zu aktivieren.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Zum Login
          </Link>
        </div>
      </div>
    </div>
  )
}
