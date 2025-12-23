import { redirect } from 'next/navigation'

export default function ConfirmPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  if (!token) {
    redirect('/login?error=invalid_link')
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

        <a
          href={verifyUrl}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 transition"
        >
          Jetzt anmelden
        </a>
      </div>
    </div>
  )
}
