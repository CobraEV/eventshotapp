'use server'

import prisma from '@/lib/prisma'

export async function getNewEventPhotos(
  eventId: string,
  afterCreatedAt: Date
) {
  return prisma.photo.findMany({
    where: {
      eventId,
      approved: true,
      createdAt: {
        gt: afterCreatedAt,
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