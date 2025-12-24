'use client'

import { addTenant } from '@/actions/add-tenant'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import {
  BuildingIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  MessageSquareWarning,
  UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function RegisterForm() {
  const [company, setCompany] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrorMsg(null)

    if (!termsAccepted) {
      return setErrorMsg('Bitte akzeptiere die AGBs, um fortzufahren.')
    }

    if (!isValidEmail) {
      return setErrorMsg('Bitte gib eine gültige E-Mail-Adresse ein.')
    }

    if (!fullName.trim()) {
      return setErrorMsg('Bitte gib deinen vollständigen Namen an.')
    }

    if (password.length < 8) {
      return setErrorMsg('Das Passwort muss mindestens 8 Zeichen lang sein.')
    }

    if (password !== password2) {
      return setErrorMsg('Die Passwörter stimmen nicht überein.')
    }

    setLoading(true)

    try {
      const res = await addTenant({
        company: company.trim() || null,
        name: fullName.trim(),
        email: email.trim(),
        password,
      })

      if (!res.ok) {
        setErrorMsg(res.message ?? 'Registrierung fehlgeschlagen.')
        return
      }

      router.push('/register/success')
    } catch (err) {
      console.error(err)
      setErrorMsg('Netzwerkfehler. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 py-12 flex items-center justify-center bg-linear-to-b from-muted/30 to-background">
      <Card className="w-full max-w-md shadow-2xl border border-border/60 backdrop-blur-xl bg-background/80 animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto bg-primary/10 p-3 w-fit rounded-full">
            <UserIcon className="text-primary" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Jetzt registrieren
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Erstelle deinen EventShot-Zugang – schnell und sicher.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Company */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Firma (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="ps-10"
                disabled={loading}
              />
              <BuildingIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            {/* Name */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Vorname Nachname *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="ps-10"
                disabled={loading}
              />
              <UserIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                placeholder="E-Mail-Adresse *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ps-10"
                disabled={loading}
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
                placeholder="Passwort *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ps-10"
                disabled={loading}
              />
              <LockIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            {/* Password repeat */}
            <div className="relative">
              <Input
                type="password"
                placeholder="Passwort wiederholen *"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="ps-10"
                disabled={loading}
              />
              <LockIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 rounded-lg border border-border/50 p-4 text-sm">
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={(v) => setTermsAccepted(Boolean(v))}
                disabled={loading}
              />
              <span>
                Ich akzeptiere die{' '}
                <Link
                  href="/agb"
                  target="_blank"
                  className="text-primary underline"
                >
                  AGBs von EventShot
                </Link>
                .
              </span>
            </label>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in fade-in duration-300">
                <MessageSquareWarning
                  size={18}
                  className="mt-0.5 shrink-0 text-destructive"
                />
                <div>
                  <p className="font-medium">Fehler</p>
                  <p className="text-muted-foreground">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-medium"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Wird registriert…
                </>
              ) : (
                'Jetzt registrieren'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Bereits Kunde?{' '}
            <Link href="/login" className="text-primary underline">
              Hier einloggen
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
