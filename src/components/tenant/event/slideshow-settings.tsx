'use client'

import { saveSlideshowSettings } from '@/actions/save-slideshow-settings'
import { getSlideshowSettings } from '@/actions/get-slideshow-settings'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { LinkIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SlideshowSettings({ eventId }: { eventId: string }) {
  const [interval, setInterval] = useState(5)
  const [controls, setControls] = useState(true)
  const [hideWatermark, setHideWatermark] = useState(false)
  const [brandLogoUrl, setBrandLogoUrl] = useState<string | null>(null)
  const [plan, setPlan] = useState<'BASIC' | 'PREMIUM' | 'ENTERPRISE'>('BASIC')

  useEffect(() => {
    getSlideshowSettings(eventId).then((s) => {
      setInterval(s.intervalMs / 1000)
      setControls(s.showControls)
      setHideWatermark(s.hideWatermark)
      setBrandLogoUrl(s.brandLogoUrl)
      setPlan(s.plan)
    })
  }, [eventId])

  const save = async () => {
    await saveSlideshowSettings({
      eventId,
      intervalMs: interval * 1000,
      showControls: controls,
      hideWatermark,
      brandLogoUrl,
    })
    toast.success('Einstellungen gespeichert')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slideshow</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Anzeigedauer ({interval}s)</Label>
          <Slider
            min={3}
            max={15}
            step={1}
            value={[interval]}
            onValueChange={([v]) => setInterval(v)}
          />
        </div>

        <div className="flex justify-between">
          <Label>Steuerung anzeigen</Label>
          <Switch checked={controls} onCheckedChange={setControls} />
        </div>

        {plan === 'ENTERPRISE' && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <Label>EventShot Wasserzeichen ausblenden</Label>
              <Switch
                checked={hideWatermark}
                onCheckedChange={setHideWatermark}
              />
            </div>

            <div className="space-y-2">
              <Label>Eigenes Branding (Logo URL)</Label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={brandLogoUrl ?? ''}
                onChange={(e) => setBrandLogoUrl(e.target.value || null)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Wird unten rechts in der Slideshow angezeigt
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={save} className="flex-1">
          Speichern
        </Button>
        <Button
          variant="secondary"
          onClick={() => window.open(`/event/${eventId}/slideshow`, '_blank')}
        >
          <LinkIcon className="h-4 w-4 mr-1" />
          Slideshow öffnen
        </Button>
      </CardFooter>
    </Card>
  )
}
