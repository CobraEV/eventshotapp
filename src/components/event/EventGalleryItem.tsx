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
      {/* BlurHash – LOWER z-index */}
      {photo.blurHash && !loaded && (
        <div className='absolute inset-0 z-0'>
          <BlurHashCanvas hash={photo.blurHash} width={32} height={32} />
        </div>
      )}

      {/* Image – HIGHER z-index */}
      <img
        src={photo.thumbUrl}
        alt='Event Foto'
        onLoad={() => setLoaded(true)}
        className='absolute inset-0 z-10 h-full w-full object-cover'
      />
    </button>
  )
}
