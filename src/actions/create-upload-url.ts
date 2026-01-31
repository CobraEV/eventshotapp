'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'

export async function createUploadUrl(eventId: string, mimeType: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { isActive: true },
  })

  if (!event || !event.isActive) {
    throw new Error('Invalid or inactive event')
  }

  const extension = mimeType.split('/')[1] ?? 'jpg'
  const objectKey = `events/${eventId}/original/${randomUUID()}.${extension}`

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET as string,
    Key: objectKey,
    ContentType: mimeType,
    CacheControl: 'public, max-age=31536000, immutable',
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

  return { uploadUrl, objectKey }
}
