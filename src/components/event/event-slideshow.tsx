'use client'

import { getEventPhotosSlideshow } from '@/actions/get-event-photos-slideshow'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Camera } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

type Photo = {
  id: string
  url: string
  createdAt: Date
}

interface Props {
  eventId: string
  autoplay?: boolean
  interval?: number
  fullscreen?: boolean
}

export default function EventSlideshow({
  eventId,
  autoplay = true,
  interval = 5000,
  fullscreen,
}: Props) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(autoplay)
  const [direction, setDirection] = useState<1 | -1>(1)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 🔁 Polling: neue Fotos laden
  useEffect(() => {
    let mounted = true

    const load = async () => {
      const data = await getEventPhotosSlideshow(eventId)
      if (!mounted) return
      setPhotos(data)
      setIndex((i) => Math.min(i, Math.max(0, data.length - 1)))
    }

    load()
    const id = setInterval(load, 10000)

    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [eventId])

  const next = useCallback(() => {
    if (photos.length <= 1) return
    setDirection(1)
    setIndex((i) => (i + 1) % photos.length)
  }, [photos.length])

  const prev = useCallback(() => {
    if (photos.length <= 1) return
    setDirection(-1)
    setIndex((i) => (i - 1 + photos.length) % photos.length)
  }, [photos.length])

  // ▶ Autoplay
  useEffect(() => {
    if (!playing || photos.length <= 1) return
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(next, interval)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [index, playing, interval, photos.length, next])

  if (photos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl font-semibold">Noch keine Fotos</p>
          <p className="text-muted-foreground mt-2">
            Fotos erscheinen hier automatisch ✨
          </p>
        </div>
      </div>
    )
  }

  const photo = photos[index]

  return (
    <div
      className={`relative h-full w-full bg-black ${
        fullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Bild */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={photo.id}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Image
            src={photo.url} // ✅ direkt aus S3
            alt="Event Foto"
            fill
            unoptimized
            className="object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Fortschrittsbalken */}
      {playing && photos.length > 1 && (
        <motion.div
          key={index}
          className="absolute bottom-0 left-0 h-1 bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: interval / 1000, ease: 'linear' }}
          style={{ transformOrigin: 'left', width: '100%' }}
        />
      )}

      {/* Counter */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold">
        {index + 1} / {photos.length}
      </div>

      {/* Logo */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg text-white">
        <Camera className="h-5 w-5 text-primary" />
        <span className="font-semibold">EventShot</span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-1 rounded-full">
        <Button variant="ghost" size="icon" onClick={prev}>
          <ChevronLeft className="text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? (
            <Pause className="text-white" />
          ) : (
            <Play className="text-white" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={next}>
          <ChevronRight className="text-white" />
        </Button>
      </div>
    </div>
  )
}
