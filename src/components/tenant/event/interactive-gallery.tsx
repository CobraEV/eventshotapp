'use client'

import { deletePhoto } from '@/actions/delete-photo'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const BATCH_SIZE = 24

export type GalleryPhoto = {
  id: string
  url: string
  createdAt: Date
}

export default function InteractiveGallery({
  photos,
  eventId,
  admin = false,
}: {
  photos: GalleryPhoto[]
  eventId: string
  admin?: boolean
}) {
  const [visible, setVisible] = useState(BATCH_SIZE)
  const [active, setActive] = useState<number | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)

  const visiblePhotos = photos.slice(0, visible)

  /* --------------------------------
   * Navigation
   * -------------------------------- */
  const next = useCallback(() => {
    if (active === null) return
    setDirection(1)
    setActive((i) => (i! + 1) % photos.length)
  }, [active, photos.length])

  const prev = useCallback(() => {
    if (active === null) return
    setDirection(-1)
    setActive((i) => (i! - 1 + photos.length) % photos.length)
  }, [active, photos.length])

  /* --------------------------------
   * Keyboard
   * -------------------------------- */
  useEffect(() => {
    if (active === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active, next, prev])

  /* --------------------------------
   * Delete
   * -------------------------------- */
  const handleDelete = async (photoId: string) => {
    await deletePhoto({ id: photoId, eventId })
    toast.success('Foto gelöscht')
  }

  /* --------------------------------
   * Render
   * -------------------------------- */
  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Fotos insgesamt:{' '}
        <span className="font-semibold text-primary">{photos.length}</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visiblePhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group overflow-hidden rounded-lg border bg-card"
          >
            <AspectRatio
              ratio={1}
              className="cursor-pointer"
              onClick={() => setActive(index)}
            >
              <Image
                src={photo.url}
                alt="Event Foto"
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>

            {admin && (
              <div className="absolute top-2 right-2 z-10">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-full bg-black/60 p-2 text-white hover:bg-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Foto löschen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Dieses Foto wird dauerhaft gelöscht.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(photo.id)}
                      >
                        Löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        ))}

        {/* Skeletons */}
        {visible < photos.length &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`sk-${i}`} className="aspect-square rounded-lg" />
          ))}
      </div>

      {/* Load more */}
      {visible < photos.length && (
        <div className="text-center">
          <button
            onClick={() =>
              setVisible((v) => Math.min(v + BATCH_SIZE, photos.length))
            }
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
          >
            Mehr laden
          </button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={photos[active].id}
                  src={photos[active].url}
                  alt="Event Foto"
                  className="max-h-[80vh] max-w-full object-contain"
                  initial={{ x: direction * 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -direction * 200, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {/* Controls */}
              <button
                className="absolute top-4 right-4 text-white"
                onClick={() => setActive(null)}
              >
                <X />
              </button>

              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-white"
                onClick={prev}
              >
                <ChevronLeft />
              </button>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white"
                onClick={next}
              >
                <ChevronRight />
              </button>

              <div className="mt-4 text-center text-white text-sm">
                {active + 1} / {photos.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
