'use client'

import { sendLogin } from '@/actions/sendLogin'
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
  MessageSquareWarning,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isValidEmail) return

    setIsLoading(true)
    setError(null)

    const res = await sendLogin(email)

    if (!res.ok) {
      setError(res.message)
      setIsLoading(false)
      setSent(false)
      return
    }

    setSent(true)
    setIsLoading(false)
  }

  return (
    <div className="flex-1 py-12 flex items-center justify-center bg-linear-to-b from-muted/30 to-background">
      <Card className="w-full max-w-md shadow-2xl border border-border/60 backdrop-blur-xl bg-background/80 animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto bg-primary/10 p-3 w-fit rounded-full">
            <LogInIcon className="text-primary" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Willkommen
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Gib deine E-Mail-Adresse ein – wir senden dir einen sicheren
            Anmelde-Link.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Input
                type="email"
                name="email"
                placeholder="E-Mail-Adresse"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                  setSent(false)
                }}
                disabled={isLoading || sent}
                autoComplete="email"
                autoFocus
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

            <Button
              type="submit"
              disabled={isLoading || sent || !isValidEmail}
              className="w-full font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Wird gesendet…
                </>
              ) : sent ? (
                <>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Link gesendet
                </>
              ) : (
                <>
                  <LogInIcon className="mr-2 h-4 w-4" />
                  Anmelden
                </>
              )}
            </Button>
          </form>

          {/* Error message */}
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

          {/* Success message */}
          {sent && !error && (
            <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary animate-in fade-in duration-300">
              <MailIcon size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">E-Mail gesendet</p>
                <p className="text-muted-foreground">
                  Bitte prüfe dein Postfach und klicke auf den Link in der
                  E-Mail, um dich anzumelden.
                </p>
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
