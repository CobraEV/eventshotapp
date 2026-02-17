'use server'

import { processPhoto } from '@/actions/process-photo'
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

  return { photoId: photo.id }
}
