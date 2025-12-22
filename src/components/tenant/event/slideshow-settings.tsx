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
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { LinkIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SlideshowSettings({ eventId }: { eventId: string }) {
  const storageKey = `slideshow:${eventId}`

  const [interval, setInterval] = useState(5)
  const [autoplay, setAutoplay] = useState(true)
  const [controls, setControls] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return
    const data = JSON.parse(raw)
    setInterval(data.interval / 1000)
    setAutoplay(data.autoplay)
    setControls(data.controls)
  }, [storageKey])

  const save = () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        interval: interval * 1000,
        autoplay,
        controls,
      })
    )
    toast.success('Einstellungen gespeichert')
  }

  const openSlideshow = () => {
    window.open(`/event/${eventId}/slideshow`, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slideshow</CardTitle>
        <CardDescription>
          Anzeigeeinstellungen für die Event-Wall
        </CardDescription>
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
          <Label>Autoplay</Label>
          <Switch checked={autoplay} onCheckedChange={setAutoplay} />
        </div>

        <div className="flex justify-between">
          <Label>Steuerung anzeigen</Label>
          <Switch checked={controls} onCheckedChange={setControls} />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={save} className="flex-1">
          Speichern
        </Button>
        <Button variant="secondary" onClick={openSlideshow}>
          <LinkIcon className="h-4 w-4 mr-1" />
          Slideshow öffnen
        </Button>
      </CardFooter>
    </Card>
  )
}
