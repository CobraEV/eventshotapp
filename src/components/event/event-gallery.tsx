'use client'

import { useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'

import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/styles.css'
import { EventGalleryItem } from './EventGalleryItem'

type Photo = {
  id: string
  url: string
  thumbUrl: string
  blurHash: string | null
}

export default function EventGallery({
  photos,
  eventId,
}: {
  photos: Photo[]
  eventId: string
}) {
  const [index, setIndex] = useState(-1)

  const slides = useMemo(
    () =>
      photos.map((p) => ({
        src: p.url,
        download: `/api/photo/${p.id}/download?event=${eventId}`,
      })),
    [photos, eventId],
  )

  if (photos.length === 0) {
    return (
      <div className='py-20 text-center text-muted-foreground'>
        Noch keine Fotos – lade das erste hoch
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {photos.map((photo, i) => (
          <EventGalleryItem
            key={i.toString()}
            photo={photo}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Counter, Download]}
        on={{
          view: ({ index }) => {
            setIndex(index)

            // 🔥 Preload next / prev
            const preload = (src?: string) => {
              if (!src) return
              const img = new Image()
              img.src = src
            }

            preload(slides[index + 1]?.src)
            preload(slides[index - 1]?.src)
          },
        }}
      />
    </>
  )
}
