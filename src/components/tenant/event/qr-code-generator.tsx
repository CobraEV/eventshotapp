'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Download } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function QRCodeGenerator({ eventId }: { eventId: string }) {
  const [url, setUrl] = useState('')
  const qrRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(`${window.location.origin}/event/${eventId}`)
    }
  }, [eventId])

  const copy = async () => {
    await navigator.clipboard.writeText(url)
    toast.success('URL kopiert')
  }

  const download = () => {
    const canvas = qrRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'event-qr-code.png'
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR-Code</CardTitle>
        <CardDescription>
          Gäste scannen den Code, um Fotos hochzuladen
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Label>Event-URL</Label>
        <div className="flex gap-2">
          <Input value={url} disabled />
          <Button variant="outline" size="icon" onClick={copy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center pt-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeCanvas value={url} size={200} ref={qrRef} />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={download} className="w-full gap-2">
          <Download className="h-4 w-4" />
          QR-Code herunterladen
        </Button>
      </CardFooter>
    </Card>
  )
}
