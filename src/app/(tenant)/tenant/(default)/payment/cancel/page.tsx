import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold">Zahlung abgebrochen</h1>

        <p className="text-muted-foreground">
          Die Zahlung wurde abgebrochen oder nicht abgeschlossen. Es wurde kein
          Event erstellt.
        </p>

        <p className="text-sm text-muted-foreground">
          Du kannst den Vorgang jederzeit erneut starten.
        </p>

        <div className="flex flex-col gap-2 pt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/tenant">Zurück zum Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
