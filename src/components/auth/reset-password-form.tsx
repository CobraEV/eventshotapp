'use client'

import { LockIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
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
import { resetPassword } from '@/actions/reset-password'

export default function ResetPasswordPage({ token }: { token: string }) {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isPending, startTransition] = useTransition()

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center text-center">
        <div className="text-destructive font-medium">
          ❌ Ungültiger oder abgelaufener Link.
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Das Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    if (password !== confirm) {
      toast.error('Die Passwörter stimmen nicht überein.')
      return
    }

    startTransition(async () => {
      const res = await resetPassword(token, password)

      if ('error' in res) {
        toast.error(res.error)
      } else {
        toast.success('Dein Passwort wurde erfolgreich geändert.')
        setTimeout(() => router.push('/login'), 1500)
      }
    })
  }

  return (
    <div className="flex-1 w-full py-12 flex items-center justify-center bg-linear-to-b from-muted/30 to-background">
      <Card className="w-full max-w-md shadow-2xl border border-border/60 backdrop-blur-xl bg-background/80 animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto bg-primary/10 p-3 w-fit rounded-full">
            <LockIcon className="text-primary" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Neues Passwort setzen
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Gib dein neues Passwort ein, um dein Konto zu sichern.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Input
                type="password"
                placeholder="Neues Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="ps-10"
              />
              <LockIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <div className="relative">
              <Input
                type="password"
                placeholder="Passwort bestätigen"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={isPending}
                className="ps-10"
              />
              <LockIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Wird gespeichert…' : 'Passwort speichern'}
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
