'use server'

import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { generateBlurHash } from '@/lib/image/blurhash'
import { generateThumbnail } from '@/lib/image/resize'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'

export async function processPhoto(photoId: string) {
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
  })

  if (!photo) throw new Error('Photo not found')

  const original = await s3.send(
    new GetObjectCommand({
      Bucket: photo.bucket,
      Key: photo.objectKey,
    }),
  )

  if (!original.Body) throw new Error('Original not found')

  const originalBuffer = Buffer.from(await original.Body.transformToByteArray())

  // 🔥 Dimensionen lesen
  const image = sharp(originalBuffer)
  const meta = await image.metadata()

  const blurHash = await generateBlurHash(originalBuffer)
  const thumbBuffer = await generateThumbnail(originalBuffer)

  const thumbKey = `events/${photo.eventId}/thumb/${photo.id}.jpg`

  await s3.send(
    new PutObjectCommand({
      Bucket: photo.bucket,
      Key: thumbKey,
      Body: thumbBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )

  await prisma.photo.update({
    where: { id: photo.id },
    data: {
      thumbUrl: `${process.env.S3_PUBLIC_URL}/${thumbKey}`,
      blurHash,
      width: meta.width ?? 1,
      height: meta.height ?? 1,
    },
  })
}
