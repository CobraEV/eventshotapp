'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Loader2Icon,
  LogInIcon,
  MailIcon,
  LockIcon,
  MessageSquareWarning,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!isValidEmail || !password) {
      setError('Bitte E-Mail-Adresse und Passwort eingeben.')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: '/tenant',
        rememberMe: true,
      })

      if (error?.message) {
        setError(error.message)
        return
      }

      // Erfolgreich eingeloggt
      router.push('/tenant')
    } catch (err) {
      console.error(err)
      setError('Netzwerkfehler. Bitte versuche es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 py-12 flex items-center justify-center bg-linear-to-b from-muted/30 to-background">
      <Card className="w-full max-w-md shadow-2xl border border-border/60 backdrop-blur-xl bg-background/80 animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto bg-primary/10 p-3 w-fit rounded-full">
            <LogInIcon className="text-primary" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Willkommen zurück
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Melde dich mit deiner E-Mail-Adresse und deinem Passwort an.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                placeholder="E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                className={`ps-10 ${
                  error
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                }`}
              />
              <MailIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className={`ps-10 ${
                  error
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                }`}
              />
              <LockIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                Passwort vergessen?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Anmeldung läuft…
                </>
              ) : (
                <>
                  <LogInIcon className="mr-2 h-4 w-4" />
                  Anmelden
                </>
              )}
            </Button>
          </form>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in fade-in duration-300">
              <MessageSquareWarning
                size={18}
                className="mt-0.5 shrink-0 text-destructive"
              />
              <div>
                <p className="font-medium">Fehler</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Noch kein Account?{' '}
            <Link href="/register" className="text-primary underline">
              Jetzt registrieren
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Zurück zur Startseite
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
