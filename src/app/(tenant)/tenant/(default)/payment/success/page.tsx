import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>

        <h1 className="text-2xl font-bold">Zahlung erfolgreich</h1>

        <p className="text-muted-foreground">
          Vielen Dank! Deine Zahlung war erfolgreich. Dein Event wird jetzt
          automatisch erstellt und freigeschaltet.
        </p>

        <p className="text-sm text-muted-foreground">
          Dies kann einen kurzen Moment dauern. Du wirst gleich im Dashboard
          dein neues Event sehen.
        </p>

        <div className="pt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/tenant">Zum Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
