'use server'

import prisma from '@/lib/prisma'

export async function getEventPhotosSlideshow(
  eventId: string,
  afterId?: string | null,
) {
  return prisma.photo.findMany({
    where: {
      eventId,
      approved: true,
      ...(afterId && { id: { gt: afterId } }),
    },
    orderBy: { id: 'asc' },
    take: 50,
    select: {
      id: true,
      url: true,
    },
  })
}
