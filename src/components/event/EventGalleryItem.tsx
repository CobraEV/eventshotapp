'use client'

import { useState } from 'react'
import { BlurHashCanvas } from '@/components/BlurHashCanvas'

export function EventGalleryItem({
  photo,
  onClick,
}: {
  photo: {
    id: string
    thumbUrl: string
    blurHash: string | null
  }
  onClick: () => void
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <button
      type='button'
      onClick={onClick}
      className='relative aspect-square overflow-hidden rounded-lg bg-muted'
    >
      {photo.blurHash && (
        <BlurHashCanvas
          hash={photo.blurHash}
          width={32}
          height={32}
          visible={!loaded}
        />
      )}

      <img
        src={photo.thumbUrl}
        alt='Event Foto'
        loading='lazy'
        decoding='async'
        className='relative z-10 h-full w-full object-cover transition-opacity duration-300 md:transition-transform md:hover:scale-105'
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
      />
    </button>
  )
}
