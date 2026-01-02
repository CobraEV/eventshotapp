'use server'

import prisma from '@/lib/prisma'
import { getSignedDownloadUrl } from '@/lib/s3-presigned'

export async function getPhotoDownloadUrl(photoId: string) {
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
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
