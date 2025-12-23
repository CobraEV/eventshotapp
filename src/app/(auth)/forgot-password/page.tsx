'use client'

import { useState, useTransition } from 'react'
import { MailIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { requestPasswordReset } from '@/actions/request-password-reset'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Bitte gib deine E-Mail-Adresse ein.')
      return
    }

    startTransition(async () => {
      const res = await requestPasswordReset(email)

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(
          'Falls ein Konto existiert, wurde eine E-Mail zum Zurücksetzen gesendet.'
        )
      }
    })
  }

  return (
    <div className="flex-1 py-12 flex items-center justify-center bg-linear-to-b from-muted/30 to-background">
      <Card className="w-full max-w-md shadow-2xl border border-border/60 backdrop-blur-xl bg-background/80 animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto bg-primary/10 p-3 w-fit rounded-full">
            <MailIcon className="text-primary" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Passwort zurücksetzen
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen deines
            Passworts zu erhalten.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                autoComplete="email"
                className="ps-10"
              />
              <MailIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Wird gesendet…' : 'Link senden'}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              Zurück zur Anmeldung
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
