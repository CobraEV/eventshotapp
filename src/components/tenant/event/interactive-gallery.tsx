'use client'

import { deletePhoto } from '@/actions/delete-photo'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
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

import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'

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
  /* --------------------------------
   * State
   * -------------------------------- */
  const [visible, setVisible] = useState(BATCH_SIZE)
  const [items, setItems] = useState<GalleryPhoto[]>(photos)
  const [index, setIndex] = useState<number>(-1)

  /* --------------------------------
   * Sync items
   * -------------------------------- */
  useEffect(() => {
    setItems(photos)
  }, [photos])

  const visiblePhotos = useMemo(() => items.slice(0, visible), [items, visible])

  /* --------------------------------
   * Delete handler (shared)
   * -------------------------------- */
  const handleDelete = async (photoId: string) => {
    await deletePhoto({ id: photoId, eventId })
    toast.success('Foto gelöscht')

    setItems((prev) => prev.filter((p) => p.id !== photoId))

    setIndex((i) => {
      if (i <= 0) return -1
      return i - 1
    })
  }

  /* --------------------------------
   * Render
   * -------------------------------- */
  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Fotos insgesamt:{' '}
        <span className="font-semibold text-primary">{items.length}</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visiblePhotos.map((photo, i) => (
          <div
            key={photo.id}
            className="relative group overflow-hidden rounded-lg border bg-card"
          >
            <AspectRatio
              ratio={1}
              className="cursor-pointer"
              onClick={() => setIndex(i)}
            >
              <Image
                src={photo.url}
                alt="Event Foto"
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>

            {/* Admin delete overlay */}
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
        {visible < items.length &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`sk-${i}`} className="aspect-square rounded-lg" />
          ))}
      </div>

      {/* Load more */}
      {visible < items.length && (
        <div className="text-center">
          <button
            onClick={() =>
              setVisible((v) => Math.min(v + BATCH_SIZE, items.length))
            }
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
          >
            Mehr laden
          </button>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={items.map((photo) => ({ src: photo.url }))}
        plugins={[Counter]}
        on={{
          view: ({ index }) => setIndex(index),
        }}
        render={{
          slideFooter: () =>
            admin ? (
              <div className="absolute bottom-6 right-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="rounded-full bg-red-600/90 hover:bg-red-700 text-white p-3 shadow-lg"
                      title="Foto löschen"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className='z-9999'>
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
                        onClick={() => {
                          const photo = items[index]
                          if (!photo) return
                          handleDelete(photo.id)
                        }}
                      >
                        Löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : null,
        }}
      />
    </div>
  )
}
