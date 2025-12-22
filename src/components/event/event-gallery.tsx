'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

type Photo = {
  id: string
  url: string
  createdAt: Date
}

export default function EventGallery({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

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
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(index)}
            className="relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={photo.url}
              alt="Event Foto"
              fill
              className="object-cover hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 50vw, 25vw"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.img
              key={photos[activeIndex].id}
              src={photos[activeIndex].url}
              alt="Event Foto"
              className="max-w-[90vw] max-h-[90vh] object-contain"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
