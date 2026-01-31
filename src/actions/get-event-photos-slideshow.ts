'use server'

import prisma from '@/lib/prisma'

export async function getEventPhotosSlideshow(eventId: string) {
  return prisma.photo.findMany({
    where: {
      eventId,
      approved: true,
      status: {
        in: ['processing', 'ready'],
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
      url: true,
      createdAt: true,
    },
  })
}
