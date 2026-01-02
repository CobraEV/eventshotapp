'use server'

import prisma from '@/lib/prisma'

export async function finalizeUpload(params: {
  objectKey: string
  originalName: string
  size: number
}) {
  const { objectKey, originalName, size } = params

  const photo = await prisma.photo.update({
    where: { objectKey },
    data: { originalName, size },
    select: { eventId: true },
  })

  await prisma.event.update({
    where: { id: photo.eventId },
    data: {
      zipReady: false,
      zipKey: null,
      zipBuilding: false,
      zipProgress: 0,
      photosUpdatedAt: new Date(),
    },
  })

  return { success: true }
}
