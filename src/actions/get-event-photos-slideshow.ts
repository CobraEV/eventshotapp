'use server'

import prisma from '@/lib/prisma'

export async function getEventPhotosSlideshow(eventId: string) {
  return prisma.photo.findMany({
    where: {
      eventId,
      approved: true,
    },
    orderBy: {
      createdAt: 'asc', // für Slideshow logisch
    },
    select: {
      id: true,
      url: true, // ✅ S3 / MinIO Public URL
      createdAt: true,
    },
  })
}
