'use server'

import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { generateBlurHash } from '@/lib/image/blurhash'
import { generateThumbnail } from '@/lib/image/resize'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { getSignedViewUrl } from '@/lib/s3-presigned'

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

  let originalBuffer = Buffer.from(await original.Body.transformToByteArray()) as Buffer

  // 🔄 Convert SVG to PNG if needed
  let finalObjectKey = photo.objectKey
  let finalMimeType = photo.mimeType

  if (photo.mimeType === 'image/svg+xml') {
    console.log('🔄 Converting SVG to PNG...')

    // Convert SVG to PNG with good quality
    const convertedBuffer = await sharp(originalBuffer)
      .png({ quality: 95 })
      .toBuffer()

    // Upload converted PNG
    const newKey = photo.objectKey.replace(/\.svg$/i, '.png')
    await s3.send(
      new PutObjectCommand({
        Bucket: photo.bucket,
        Key: newKey,
        Body: convertedBuffer,
        ContentType: 'image/png',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    )

    originalBuffer = convertedBuffer as Buffer
    finalObjectKey = newKey
    finalMimeType = 'image/png'
  }

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

  // Generate presigned URLs with 7-day expiration
  const [url, thumbUrl] = await Promise.all([
    getSignedViewUrl(finalObjectKey, 60 * 60 * 24 * 7), // 7 days
    getSignedViewUrl(thumbKey, 60 * 60 * 24 * 7), // 7 days
  ])

  await prisma.photo.update({
    where: { id: photo.id },
    data: {
      objectKey: finalObjectKey,
      mimeType: finalMimeType,
      url,
      thumbUrl,
      blurHash,
      width: meta.width ?? 1,
      height: meta.height ?? 1,
    },
  })
}
