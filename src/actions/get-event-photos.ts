'use server'

import prisma from '@/lib/prisma'

export async function getEventPhotos(eventId: string) {
  const photos = await prisma.photo.findMany({
    where: {
      eventId,
      approved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      url: true,
      createdAt: true,
    },
  })

  return photos
}
