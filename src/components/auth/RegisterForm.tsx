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
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  BuildingIcon,
  Loader2Icon,
  MailIcon,
  UserIcon,
  MessageSquareWarning,
} from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useEffect, useState, useTransition } from 'react'
import { checkEmailAvailable } from '@/actions/check-email-available'

type Availability = 'idle' | 'checking' | 'free' | 'taken' | 'invalid' | 'error'

export default function RegisterForm() {
  const [company, setCompany] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  const [emailAvail, setEmailAvail] = useState<Availability>('idle')
  const [isPending, startTransition] = useTransition()

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // E-Mail availability check
  useEffect(() => {
    const val = email.trim()
    if (!val) return setEmailAvail('idle')
    if (!isValidEmail) return setEmailAvail('invalid')

    setEmailAvail('checking')
    const t = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await checkEmailAvailable(val)
          setEmailAvail(res.available ? 'free' : 'taken')
        } catch {
          setEmailAvail('error')
        }
      })
    }, 350)

    return () => clearTimeout(t)
  }, [email, isValidEmail, startTransition])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrorMsg(null)
    setSuccess(false)

    if (!termsAccepted)
      return setErrorMsg('Bitte akzeptiere die AGBs, um fortzufahren.')

    if (!isValidEmail || emailAvail === 'taken' || emailAvail === 'invalid')
      return setErrorMsg('Diese E-Mail ist ungültig oder bereits vergeben.')

    if (!fullName.trim()) {
      return setErrorMsg('Bitte gib deinen vollständigen Namen an.')
    }

    setLoading(true)
    try {
      const payload = {
        company: company.trim() || null,
        name: fullName.trim(),
        email: email.trim(),
      }

      const res = await addTenant(payload)

      if (!res.ok) {
        if (res.fieldErrors?.email) setEmailAvail('taken')
        setErrorMsg(res.message || 'Bitte Eingaben prüfen.')
        return
      }

      // callbackURL for magic link → returned from server
      setPendingUrl(res.callbackURL ?? null)
      setSuccess(true)
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
            Erstelle deinen EventShot-Zugang – schnell, sicher und kostenlos.
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
                className={`ps-10 ${
                  emailAvail === 'invalid' || emailAvail === 'taken'
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                }`}
                disabled={loading}
              />
              <MailIcon
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

            {/* Success Popup */}
            {(success || pendingUrl) && (
              <Card className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur">
                <CardContent className="p-8 text-center bg-background rounded-3xl">
                  <MailIcon className="mx-auto mb-4" />
                  <h2 className="text-lg font-semibold">
                    Bitte Postfach prüfen
                  </h2>
                  <p className="mt-2 text-sm">
                    Wir haben einen Magic-Link an {email} gesendet.
                  </p>
                  <Button asChild className="mt-6 w-full">
                    <a href="mailto:">Mail-App öffnen</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={
                loading ||
                isPending ||
                !termsAccepted ||
                !fullName.trim() ||
                !email.trim()
              }
              className="w-full font-medium"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Wird gesendet…
                </>
              ) : (
                'Jetzt starten!'
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
