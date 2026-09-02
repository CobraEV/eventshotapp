'use server'

import prisma from '@/lib/prisma'
import { getSignedDownloadUrl } from '@/lib/s3-presigned'

/**
 * Signierte URL fuer ein einzelnes Foto — bewusst ohne Session: der Gast holt
 * sich hier direkt nach dem Hochladen sein eigenes Bild.
 *
 * Die eventId ist trotzdem Pflicht. Vorher genuegte die photoId allein, und
 * damit liess sich jedes Foto jedes Kunden abrufen, auch ein aussortiertes
 * oder eines aus einem abgeschalteten Event. Gefiltert wird jetzt wie die
 * Galerie filtert — nur was oeffentlich sichtbar ist, ist auch ladbar.
 */
export async function getPhotoDownloadUrl(photoId: string, eventId: string) {
  const photo = await prisma.photo.findFirst({
    where: {
      id: photoId,
      eventId,
      approved: true,
      // 'processing' gehoert dazu: die Slideshow zeigt solche Bilder bereits
      // an, ein reiner 'ready'-Filter machte sichtbare Fotos unladbar.
      status: { in: ['processing', 'ready'] },
      event: { isActive: true },
    },
    select: {
      objectKey: true,
      originalName: true,
    },
  })

  if (!photo) {
    throw new Error('Photo not found')
  }

  const url = await getSignedDownloadUrl(photo.objectKey)

  return {
    url,
    filename: photo.originalName ?? 'eventshot.jpg',
  }
}
