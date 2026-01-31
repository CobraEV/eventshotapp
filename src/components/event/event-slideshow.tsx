'use client'

import { motion } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getEventPhotosSlideshow } from '@/actions/get-event-photos-slideshow'
import { Button } from '@/components/ui/button'

type Photo = {
  id: string
  url: string
  createdAt: Date
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

  try {
    await img.decode()
  } catch {
    return
  }

  decodeCache.set(src, img)

  if (decodeCache.size > DECODE_CACHE_LIMIT) {
    const it = decodeCache.keys().next()
    if (!it.done) decodeCache.delete(it.value)
  }
}

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
  const [slideTick, setSlideTick] = useState(0)

  const lastCreatedAtRef = useRef<Date | null>(null)

  /* =======================
     📥 Initial Load
     ======================= */
  useEffect(() => {
    let active = true

    const load = async () => {
      const data = await getEventPhotosSlideshow(eventId)
      if (!active) return

      setPhotos(data)

      if (data.length > 0) {
        lastCreatedAtRef.current = data[data.length - 1].createdAt
      }
    }

    load()
    return () => {
      active = false
    }
  }, [eventId])

  /* =======================
     📡 SSE – Realtime
     ======================= */
  useEffect(() => {
    const es = new EventSource(`/api/slideshow/stream/${eventId}`)

    es.onmessage = async (e) => {
      const msg = JSON.parse(e.data)

      if (msg.type === 'photos-updated') {
        const data = await getEventPhotosSlideshow(eventId)

        setPhotos(data)

        if (data.length > 0) {
          lastCreatedAtRef.current = data[data.length - 1].createdAt
        }
      }
    }

    es.onerror = () => {
      es.close()
    }

    return () => {
      es.close()
    }
  }, [eventId])

  const current = photos[index]

  /* =======================
     🖼 Decode Current
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
  }, [current])

  /* =======================
     🔮 Preload Ahead
     ======================= */
  useEffect(() => {
    if (photos.length < 2) return

    preloadAndDecodeLRU(photos[(index + 1) % photos.length].url)
    preloadAndDecodeLRU(photos[(index + 2) % photos.length].url)
  }, [index, photos])

  /* =======================
     ▶ Autoplay
     ======================= */
  useEffect(() => {
    if (!playing || !ready || photos.length <= 1) return

    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % photos.length)
      setSlideTick((t) => t + 1)
    }, interval)

    return () => clearTimeout(id)
  }, [playing, ready, interval, photos.length])

  if (photos.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-white'>
        <p className='text-xl font-semibold'>Noch keine Fotos</p>
      </div>
    )
  }

  return (
    <div
      className={`relative h-full w-full bg-black ${
        fullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      <motion.div
        key={current.id}
        className='absolute inset-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <img
          src={current.url}
          alt='Event Foto'
          className='absolute inset-0 h-full w-full object-contain'
          draggable={false}
        />
      </motion.div>

      {playing && ready && photos.length > 1 && (
        <motion.div
          key={slideTick}
          className='absolute bottom-0 left-0 h-1 bg-primary'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: interval / 1000,
            ease: 'linear',
          }}
          style={{ transformOrigin: 'left', width: '100%' }}
        />
      )}

      <div className='absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white'>
        {index + 1} / {photos.length}
      </div>

      {!hideWatermark && !brandLogoUrl && (
        <div className='absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-white'>
          <Camera className='h-5 w-5 text-primary' />
          <span className='font-semibold'>EventShot</span>
        </div>
      )}

      {brandLogoUrl && (
        <div className='absolute bottom-4 right-4 rounded-lg bg-black/60 p-2'>
          <img src={brandLogoUrl} alt='slideshowimage' className='h-8 w-auto' />
        </div>
      )}

      {controls && (
        <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/60 p-1'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              setIndex((i) => (i - 1 + photos.length) % photos.length)
              setSlideTick((t) => t + 1)
            }}
          >
            <ChevronLeft className='text-white' />
          </Button>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause /> : <Play />}
          </Button>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              setIndex((i) => (i + 1) % photos.length)
              setSlideTick((t) => t + 1)
            }}
          >
            <ChevronRight className='text-white' />
          </Button>
        </div>
      )}
    </div>
  )
}
