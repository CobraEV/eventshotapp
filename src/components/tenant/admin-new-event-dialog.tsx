'use client'

import { Gift, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { AdminKundeOption } from '@/actions/admin-events'
import { createEventAsAdmin } from '@/actions/admin-events'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Event kostenlos anlegen — nur fuer den Betreiber.
 *
 * Bewusst ein eigener Dialog neben dem regulaeren: der regulaere fuehrt zu
 * Stripe, dieser nicht. Ein gemeinsamer mit einem Schalter "kostenlos" waere
 * genau die Art Abzweigung, bei der irgendwann jemand den falschen Weg nimmt.
 */
export function AdminNewEventDialog({
  kunden,
}: {
  kunden: AdminKundeOption[]
}) {
  const [open, setOpen] = useState(false)
  const [laeuft, setLaeuft] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Gift className="h-4 w-4 text-primary" />
          Gratis-Event anlegen
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Event kostenlos anlegen</DialogTitle>
          <DialogDescription>
            Ohne Zahlung, für einen Kunden oder für dich selbst. Das Event
            trägt keine Stripe-Sitzung und zählt in der Kundenübersicht als
            Gratis-Event.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          action={async (fd) => {
            setLaeuft(true)
            const res = await createEventAsAdmin({
              kunde: String(fd.get('kunde') ?? ''),
              name: String(fd.get('name') ?? ''),
              plan: String(fd.get('plan') ?? 'PREMIUM') as never,
              date: String(fd.get('date') ?? ''),
              location: String(fd.get('location') ?? ''),
              description: String(fd.get('description') ?? ''),
            })
            setLaeuft(false)

            if (!res.ok) {
              toast.error(res.message)
              return
            }
            toast.success('Event angelegt')
            setOpen(false)
            router.push(`/tenant/event/${res.eventId}`)
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="kunde">Für wen?</Label>
            <select
              id="kunde"
              name="kunde"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {kunden.map((k) => (
                <option key={k.wert} value={k.wert}>
                  {k.label} — {k.email}
                </option>
              ))}
            </select>
            {kunden.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Noch keine Kunden vorhanden.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name des Events</Label>
            <Input id="name" name="name" required placeholder="Hochzeit Anna & Ben" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Paket</Label>
              <select
                id="plan"
                name="plan"
                defaultValue="PREMIUM"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ort (optional)</Label>
            <Input id="location" name="location" placeholder="Restaurant Sonne, Winterthur" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung (optional)</Label>
            <Input id="description" name="description" />
          </div>

          <Button type="submit" disabled={laeuft || kunden.length === 0} className="w-full">
            {laeuft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kostenlos anlegen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
