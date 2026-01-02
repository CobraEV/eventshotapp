'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'

type Photo = {
  id: string
  url: string
  createdAt: Date
}

export default function EventGallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(-1)

  const slides = useMemo(
    () =>
      photos.map((p) => ({
        src: p.url,
        download: `/api/photo/${p.id}/download`,
      })),
    [photos]
  )

  if (photos.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Noch keine Fotos – lade das erste hoch
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setIndex(i)}
            className="relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={photo.url}
              alt="Event Foto"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={40}
              priority={i < 6}
              className="object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Counter, Download]}
        on={{ view: ({ index }) => setIndex(index) }}
      />
    </>
  )
}
