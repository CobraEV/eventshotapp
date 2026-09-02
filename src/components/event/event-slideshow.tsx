/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
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
  /** Schluessel fuer den SSE-Stream — steht nicht auf der Tischkarte. */
  publicCode: string
  interval?: number
  controls?: boolean
  fullscreen?: boolean
  hideWatermark?: boolean
  brandLogoUrl?: string | null
}

/* -----------------------
   Client ID (device)
----------------------- */
function getClientId() {
  let id = localStorage.getItem('eventshot-client-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('eventshot-client-id', id)
  }
  return id
}

/* -----------------------
   Decode Cache
----------------------- */
const DECODE_CACHE_LIMIT = 6
const decodeCache = new Map<string, HTMLImageElement>()

async function preload(src?: string) {
  if (!src) return
  if (decodeCache.has(src)) return

  const img = new Image()
  img.src = src

  try {
    await img.decode()
    decodeCache.set(src, img)

    if (decodeCache.size > DECODE_CACHE_LIMIT) {
      const firstKey = decodeCache.keys().next().value
      if (firstKey) decodeCache.delete(firstKey)
    }
  } catch {
    // ignore decode errors
  }
}

export default function EventSlideshow({
  eventId,
  publicCode,
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
  const [progress, setProgress] = useState(0)
  const [blocked, setBlocked] = useState(false)

  const startTimeRef = useRef<number>(performance.now())
  const rafRef = useRef<number | null>(null)
  const clientIdRef = useRef<string | null>(null)

  /* -----------------------
     Initial load
  ----------------------- */
  useEffect(() => {
    let alive = true

    getEventPhotosSlideshow(eventId).then((data) => {
      if (!alive) return
      setPhotos(data)
      setIndex(0)
      setProgress(0)
      startTimeRef.current = performance.now()
    })

    return () => {
      alive = false
    }
  }, [eventId, publicCode])

  /* -----------------------
     SSE (SCREEN LIMIT!)
  ----------------------- */
  useEffect(() => {
    clientIdRef.current = getClientId()

    const es = new EventSource(
      `/api/slideshow/stream/${eventId}?clientId=${clientIdRef.current}&code=${publicCode}`,
    )

    es.onmessage = async (e) => {
      const msg = JSON.parse(e.data)
      if (msg.type === 'photos-updated') {
        const data = await getEventPhotosSlideshow(eventId)
        setPhotos(data)
      }
    }

    es.onerror = async () => {
      // 403 → Screen-Limit
      try {
        const res = await fetch(
          `/api/slideshow/stream/${eventId}?clientId=${clientIdRef.current}&code=${publicCode}`,
        )
        if (res.status === 403) {
          setBlocked(true)
          setPlaying(false)
        }
      } catch {}
      es.close()
    }

    return () => {
      es.close()
    }
  }, [eventId, publicCode])

  const current = photos[index]

  /* -----------------------
     Decode current
  ----------------------- */
  useEffect(() => {
    if (!current) return
    setReady(false)
    preload(current.url).then(() => setReady(true))
  }, [current?.url])

  /* -----------------------
     Preload ahead
  ----------------------- */
  useEffect(() => {
    if (photos.length > 1) {
      preload(photos[(index + 1) % photos.length].url)
      preload(photos[(index + 2) % photos.length].url)
    }
  }, [index, photos.length])

  /* -----------------------
     Drift-free autoplay
  ----------------------- */
  useEffect(() => {
    if (!playing || photos.length <= 1) return

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current
      const slideIndex = Math.floor(elapsed / interval) % photos.length
      const slideProgress = (elapsed % interval) / interval

      setIndex(slideIndex)
      setProgress(slideProgress)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [playing, interval, photos.length])

  /* -----------------------
     Controls
  ----------------------- */
  const jumpRelative = (delta: number) => {
    const next = (index + delta + photos.length) % photos.length
    startTimeRef.current = performance.now() - next * interval
    setIndex(next)
    setProgress(0)
  }

  /* -----------------------
     BLOCKED OVERLAY
  ----------------------- */
  if (blocked) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-black text-white'>
        <div className='text-center space-y-3'>
          <p className='text-xl font-semibold'>
            Maximale Anzahl Screens erreicht
          </p>
          <p className='text-sm opacity-70'>
            Diese Slideshow läuft bereits auf einem anderen Bildschirm.
          </p>
        </div>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-white'>
        <p className='text-xl font-semibold'>Noch keine Fotos</p>
      </div>
    )
  }

  return (
    <div
      className={`relative h-full w-full bg-black ${fullscreen ? 'fixed inset-0' : ''}`}
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
          alt='slideshowimg'
          className='absolute inset-0 h-full w-full object-contain'
          draggable={false}
        />
      </motion.div>

      {/* Progress */}
      {playing && photos.length > 1 && (
        <div className='absolute bottom-0 left-0 h-1 w-full bg-white/10'>
          <div
            className='h-full bg-primary'
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* Branding */}
      {!hideWatermark && !brandLogoUrl && (
        <div className='absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg text-white'>
          <Camera className='h-5 w-5 text-primary' />
          EventShot
        </div>
      )}

      {brandLogoUrl && (
        <div className='absolute bottom-4 right-4 bg-black/60 p-2 rounded-lg'>
          <img src={brandLogoUrl} alt='brandlogo' className='h-8 w-auto' />
        </div>
      )}

      {/* Photo Counter */}
      <div className='absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-lg text-white text-sm font-medium'>
        {index + 1} / {photos.length}
      </div>

      {controls && (
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-1 rounded-full'>
          <Button size='icon' variant='ghost' onClick={() => jumpRelative(-1)}>
            <ChevronLeft />
          </Button>

          <Button
            size='icon'
            variant='ghost'
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause /> : <Play />}
          </Button>

          <Button size='icon' variant='ghost' onClick={() => jumpRelative(1)}>
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  )
}
