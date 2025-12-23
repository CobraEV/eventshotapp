'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

export default function ConfirmPage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  )
}

const PageContent = () => {
  const params = useSearchParams()
  const router = useRouter()

  const token = params.get('token')

  // Falls kein Token → zurück zum Login
  useEffect(() => {
    if (!token) {
      router.replace('/login?error=invalid_link')
    }
  }, [token, router])

  if (!token) {
    return null
  }

  const verifyUrl = `/api/auth/magic-link/verify?token=${encodeURIComponent(
    token
  )}&callbackURL=/tenant`

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full rounded-xl border bg-background p-8 text-center space-y-6">
        <h1 className="text-xl font-semibold">Anmeldung bestätigen</h1>

        <p className="text-sm text-muted-foreground">
          Klicke auf den Button, um dich bei EventShot anzumelden.
        </p>

        {/* WICHTIG: prefetch={false}, echter User-Klick */}
        <Link
          href={verifyUrl}
          prefetch={false}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 transition"
        >
          Jetzt anmelden
        </Link>
      </div>
    </div>
  )
}
