'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { s3 } from '@/lib/s3'
import prisma from '@/lib/prisma'

export async function createUploadUrl(eventId: string, mimeType: string) {
  // Event prüfen
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, isActive: true },
  })

  if (!event || !event.isActive) {
    throw new Error('Invalid or inactive event')
  }

  // Key vorbereiten
  const extension = mimeType.split('/')[1] ?? 'jpg'
  const objectKey = `events/${eventId}/${randomUUID()}.${extension}`

  // Presigned URL
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: objectKey,
    ContentType: mimeType,
  })

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60, // Sekunden
  })

  // DB-Record (minimal, wird später ergänzt)
  await prisma.photo.create({
    data: {
      bucket: process.env.S3_BUCKET!,
      objectKey,
      url: `${process.env.S3_PUBLIC_URL}/${objectKey}`,
      originalName: '',
      mimeType,
      size: 0,
      eventId,
      approved: true,
    },
  })

  return {
    uploadUrl,
    objectKey,
  }
}
