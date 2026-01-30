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
   🔒 LRU Decode Cache
   ======================= */
const DECODE_CACHE_LIMIT = 6
const decodeCache = new Map<string, HTMLImageElement>()

async function preloadAndDecodeLRU(src: string) {
  if (decodeCache.has(src)) return

  const img = new Image()
  img.src = src
  await img.decode().catch(() => {})

  decodeCache.set(src, img)

  if (decodeCache.size > DECODE_CACHE_LIMIT) {
    const oldestKey = decodeCache.keys().next().value
    decodeCache.delete(oldestKey)
  }
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

  /** 🔑 Single source of truth for progress + slide */
  const [slideTick, setSlideTick] = useState(0)

  /* =======================
     📥 Initial Load (ONCE)
     ======================= */
  useEffect(() => {
    let active = true

    const load = async () => {
      const data = await getEventPhotosSlideshow(eventId)
      if (active) setPhotos(data)
    }

    load()
    return () => {
      active = false
    }
  }, [eventId])

  const current = photos[index]

  /* =======================
     🖼 Current Ready
     ======================= */
  useEffect(() => {
    if (!current) return

    let active = true
    setReady(false)

    preloadAndDecodeLRU(current.url).then(() => {
      if (active) setReady(true)
    })

    return () => {
      active = false
    }
  }, [current?.url])

  /* =======================
     🔮 Preload Ahead (2)
     ======================= */
  useEffect(() => {
    if (photos.length < 2) return

    preloadAndDecodeLRU(photos[(index + 1) % photos.length].url)
    preloadAndDecodeLRU(photos[(index + 2) % photos.length].url)
  }, [index])

  /* =======================
     ▶ Autoplay (deterministic)
     ======================= */
  useEffect(() => {
    if (!playing || !ready || photos.length <= 1) return

    const id = setTimeout(() => {
      setIndex(i => (i + 1) % photos.length)
      setSlideTick(t => t + 1)
    }, interval)

    return () => clearTimeout(id)
  }, [playing, ready, interval, index])

  /* =======================
     Empty
     ======================= */
  if (photos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <p className="text-xl font-semibold">Noch keine Fotos</p>
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
      {/* IMAGE */}
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

      {/* PROGRESS – 100 % SYNC */}
      {playing && ready && photos.length > 1 && (
        <motion.div
          key={slideTick}
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
            onClick={() => {
              setIndex(i => (i - 1 + photos.length) % photos.length)
              setSlideTick(t => t + 1)
            }}
          >
            <ChevronLeft className="text-white" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPlaying(p => !p)}
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
            onClick={() => {
              setIndex(i => (i + 1) % photos.length)
              setSlideTick(t => t + 1)
            }}
          >
            <ChevronRight className="text-white" />
          </Button>
        </div>
      )}
    </div>
  )
}