'use server'

import { processPhoto } from '@/lib/image/process-photo'
import prisma from '@/lib/prisma'
import { getSignedViewUrl } from '@/lib/s3-presigned'

export async function finalizeUpload({
  eventId,
  objectKey,
  mimeType,
  size,
}: {
  eventId: string
  objectKey: string
  mimeType: string
  size: number
}) {
  // Bewusst OHNE Session: das ist Schritt 3 des Gaesteweges nach dem
  // QR-Scan. Der objectKey kommt aber vom Client, und ihm zu glauben war der
  // Fehler — ein Gast konnte den Key eines fremden Events eintragen und sich
  // das Bild ueber die eigene Galerie ausliefern lassen. createUploadUrl
  // erzeugt Keys ausschliesslich in dieser Form, also wird sie erzwungen.
  if (
    !objectKey.startsWith(`events/${eventId}/original/`) ||
    objectKey.includes('..')
  ) {
    return { ok: false as const, message: 'Ungültiger Upload.' }
  }

  // Zweitens umging dieser Weg createUploadUrl komplett: weder die Pruefung
  // auf isActive noch die Foto-Obergrenze griffen hier. Wer die Action direkt
  // aufrief, schrieb an beiden vorbei.
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { isActive: true, uploadLimit: true },
  })
  if (!event?.isActive) {
    return {
      ok: false as const,
      message: 'Dieses Event nimmt derzeit keine Fotos entgegen.',
    }
  }
  if (event.uploadLimit !== null) {
    const used = await prisma.photo.count({
      where: { eventId, status: { not: 'failed' } },
    })
    if (used >= event.uploadLimit) {
      return {
        ok: false as const,
        message: `Dieses Demo-Event ist auf ${event.uploadLimit} Fotos begrenzt und voll.`,
      }
    }
  }

  // Generate presigned URL with 7-day expiration
  const url = await getSignedViewUrl(objectKey, 60 * 60 * 24 * 7) // 7 days
  
  // 1️⃣ Foto sofort anlegen
  const photo = await prisma.photo.create({
    data: {
      bucket: process.env.S3_BUCKET as string,
      objectKey,
      url,
      thumbUrl: url, // temporary, will be updated in processPhoto
      originalName: '',
      mimeType,
      size,
      eventId,
      status: 'processing',
      approved: true,
    },
  })

  // 🔔 WICHTIG: Event „anfassen“
  await prisma.event.update({
    where: { id: eventId },
    data: { photosUpdatedAt: new Date() },
  })

  try {
    // 2️⃣ Bild verarbeiten
    await processPhoto(photo.id)

    // 3️⃣ Status final
    await prisma.photo.update({
      where: { id: photo.id },
      data: { status: 'ready' },
    })

    // 🔔 NOCHMALS Event anfassen (ready!)
    await prisma.event.update({
      where: { id: eventId },
      data: { photosUpdatedAt: new Date() },
    })
  } catch (err) {
    await prisma.photo.update({
      where: { id: photo.id },
      data: { status: 'failed' },
    })

    // 🔔 auch Fehler sind relevant
    await prisma.event.update({
      where: { id: eventId },
      data: { photosUpdatedAt: new Date() },
    })

    throw err
  }

  return { ok: true as const, photoId: photo.id }
}
