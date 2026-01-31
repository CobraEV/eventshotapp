'use server'

import prisma from '@/lib/prisma'

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
  const photo = await prisma.photo.create({
    data: {
      bucket: process.env.S3_BUCKET as string,
      objectKey,
      url: `${process.env.S3_PUBLIC_URL}/${objectKey}`,
      thumbUrl: `${process.env.S3_PUBLIC_URL}/${objectKey}`, // TEMP
      originalName: '',
      mimeType,
      size,
      eventId,
      status: 'pending',
      approved: true,
    },
  })

  return { photoId: photo.id }
}
