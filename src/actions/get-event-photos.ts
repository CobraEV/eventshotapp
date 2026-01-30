'use server'

import prisma from '@/lib/prisma'

export async function getEventPhotos(eventId: string) {
  return prisma.photo.findMany({
    where: {
      eventId,
      approved: true,
    },
    orderBy: {
      createdAt: 'desc', // neueste zuerst (für Gallery)
    },
    select: {
      id: true,
      url: true,
      createdAt: true,
    },
  })
}