'use client'

import Image from 'next/image'
import { useState } from 'react'
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
  const [index, setIndex] = useState<number>(-1)

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Noch keine Fotos – lade das erste hoch 📸
      </div>
    )
  }

  return (
    <>
      {/* Grid */}
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
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={50}
              priority={i < 8}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={photos.map((photo) => ({
          src: photo.url,
          download: `/api/photo/${photo.id}/download`,
        }))}
        plugins={[Counter, Download]}
        controller={{
          closeOnBackdropClick: true,
        }}
        on={{
          view: ({ index }) => setIndex(index),
        }}
      />
    </>
  )
}
