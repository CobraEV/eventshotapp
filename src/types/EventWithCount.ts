import { Prisma } from '@/generated/prisma/client'

export type EventWithCount = Prisma.EventGetPayload<{
  select: {
    id: true
    name: true
    date: true
    location: true
    description: true
    plan: true
    isActive: true
    _count: { select: { photos: true } }
  }
}>
