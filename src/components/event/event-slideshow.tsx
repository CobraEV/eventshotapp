'use client'

import { motion } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getEventPhotosSlideshow } from '@/actions/get-event-photos-slideshow'
import { Button } from '@/components/ui/button'

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

  const lastIdRef = useRef<string | null>(null)
  const mountedRef = useRef(true)

  /* =======================
     📥 CURSOR POLLING
     ======================= */
  useEffect(() => {
    mountedRef.current = true

    const load = async () => {
      try {
        const data = await getEventPhotosSlideshow(eventId, lastIdRef.current)
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
     ▶ STABILER TIMER
     ======================= */
  useEffect(() => {
    if (!playing || photos.length <= 1) return

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length)
    }, interval)

    return () => clearInterval(id)
  }, [playing, photos.length, interval])

  if (photos.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-white'>
        <div className='text-center'>
          <p className='text-xl font-semibold'>Noch keine Fotos</p>
          <p className='text-muted-foreground mt-2'>
            Fotos erscheinen hier automatisch ✨
          </p>
        </div>
      </div>
    )
  }

  const current = photos[index]

  return (
    <div
      className={`relative h-full w-full bg-black ${
        fullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* CROSSFADE LAYER */}
      <motion.div
        key={current.id}
        className='absolute inset-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Image
          src={current.url}
          alt='Event Foto'
          fill
          className='object-contain'
          priority
          sizes='100vw'
        />
      </motion.div>

      {/* PROGRESS BAR (rein visuell) */}
      {playing && photos.length > 1 && (
        <motion.div
          key={index}
          className='absolute bottom-0 left-0 h-1 bg-primary'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: interval / 1000, ease: 'linear' }}
          style={{ transformOrigin: 'left', width: '100%' }}
        />
      )}

      {/* COUNTER */}
      <div className='absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold'>
        {index + 1} / {photos.length}
      </div>

      {/* WATERMARK */}
      {!hideWatermark && !brandLogoUrl && (
        <div className='absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg text-white'>
          <Camera className='h-5 w-5 text-primary' />
          <span className='font-semibold'>EventShot</span>
        </div>
      )}

      {brandLogoUrl && (
        <div className='absolute bottom-4 right-4 bg-black/60 p-2 rounded-lg'>
          <Image
            src={brandLogoUrl}
            alt='Brand Logo'
            width={120}
            height={32}
            unoptimized
          />
        </div>
      )}

      {/* CONTROLS */}
      {controls && (
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-1 rounded-full'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() =>
              setIndex((i) => (i - 1 + photos.length) % photos.length)
            }
          >
            <ChevronLeft className='text-white' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <Pause className='text-white' />
            ) : (
              <Play className='text-white' />
            )}
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIndex((i) => (i + 1) % photos.length)}
          >
            <ChevronRight className='text-white' />
          </Button>
        </div>
      )}
    </div>
  )
}
