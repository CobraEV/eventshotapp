'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MailIcon } from 'lucide-react'

export default function ConfirmLoginPage() {
  const params = useSearchParams()
  const token = params.get('token')

  if (!token) {
    return <p>Ungültiger Login-Link.</p>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full rounded-xl border p-6 text-center space-y-4">
        <MailIcon className="mx-auto text-primary" />
        <h1 className="text-lg font-semibold">Anmeldung bestätigen</h1>
        <p className="text-sm text-muted-foreground">
          Klicke auf den Button, um dich sicher bei EventShot anzumelden.
        </p>

        <Button
          className="w-full"
          onClick={() => {
            window.location.href = `/api/auth/magic-link/verify?token=${encodeURIComponent(
              token
            )}`
          }}
        >
          Jetzt anmelden
        </Button>
      </div>
    </div>
  )
}
