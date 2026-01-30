'use client'

import { motion } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getEventPhotosSlideshow } from '@/actions/get-event-photos-slideshow'
import { Button } from '@/components/ui/button'

/* =======================
   Types
   ======================= */
type Photo = {
  id: string
  url: string
}

interface Props {
  eventId: string
  interval?: number
  controls?: boolean
  fullscreen?: boolean
  hideWatermark?: boolean
  brandLogoUrl?: string | null
}

/* =======================
   Helpers
   ======================= */
function preloadAndDecode(src: string) {
  const img = new window.Image()
  img.src = src
  return img.decode().catch(() => {})
}

/* =======================
   Component
   ======================= */
export default function EventSlideshow({
  eventId,
  interval = 5000,
  controls = true,
  fullscreen,
  hideWatermark,
  brandLogoUrl,
}: Props) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [ready, setReady] = useState(false)

  const lastIdRef = useRef<string | null>(null)
  const mountedRef = useRef(true)

  /* =======================
     📥 CURSOR POLLING
     ======================= */
  useEffect(() => {
    mountedRef.current = true

    const load = async () => {
      try {
        const data = await getEventPhotosSlideshow(
          eventId,
          lastIdRef.current
        )

        if (!mountedRef.current || data.length === 0) return

        lastIdRef.current = data[data.length - 1].id
        setPhotos((p) => [...p, ...data])
      } catch {}
    }

    load()
    const id = setInterval(load, 10000)

    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [eventId])

  /* =======================
     🖼 Current Photo Ready
     ======================= */
  const current = photos[index]

  useEffect(() => {
    if (!current) return

    let active = true
    setReady(false)

    preloadAndDecode(current.url).then(() => {
      if (active) setReady(true)
    })

    return () => {
      active = false
    }
  }, [current?.url])

  /* =======================
     🔮 Preload Next Photos
     ======================= */
  useEffect(() => {
    if (photos.length < 2) return

    const next1 = photos[(index + 1) % photos.length]
    const next2 = photos[(index + 2) % photos.length]

    preloadAndDecode(next1.url)
    preloadAndDecode(next2.url)
  }, [index, photos])

  /* =======================
     ▶ Stable Autoplay
     ======================= */
  useEffect(() => {
    if (!playing || !ready || photos.length <= 1) return

    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % photos.length)
    }, interval)

    return () => clearTimeout(id)
  }, [playing, ready, photos.length, interval])

  /* =======================
     Empty State
     ======================= */
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

  /* =======================
     Render
     ======================= */
  return (
    <div
      className={`relative h-full w-full bg-black ${
        fullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* IMAGE LAYER */}
      <motion.div
        key={current.id}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <img
          src={current.url}
          alt="Event Foto"
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />
      </motion.div>

      {/* PROGRESS BAR */}
      {playing && ready && photos.length > 1 && (
        <motion.div
          key={index}
          className="absolute bottom-0 left-0 h-1 bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: interval / 1000, ease: 'linear' }}
          style={{ transformOrigin: 'left', width: '100%' }}
        />
      )}

      {/* COUNTER */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold">
        {index + 1} / {photos.length}
      </div>

      {/* WATERMARK */}
      {!hideWatermark && !brandLogoUrl && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg text-white">
          <Camera className="h-5 w-5 text-primary" />
          <span className="font-semibold">EventShot</span>
        </div>
      )}

      {brandLogoUrl && (
        <div className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-lg">
          <img
            src={brandLogoUrl}
            alt="Brand Logo"
            className="h-8 w-auto"
            draggable={false}
          />
        </div>
      )}

      {/* CONTROLS */}
      {controls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-1 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setIndex((i) => (i - 1 + photos.length) % photos.length)
            }
          >
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setIndex((i) => (i + 1) % photos.length)
            }
          >
            <ChevronRight className="text-white" />
          </Button>
        </div>
      )}
    </div>
  )
}