import { getSignedViewUrl } from '@/lib/s3-presigned'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const photos = await prisma.photo.findMany({
    where: { status: 'ready' },
    select: { id: true, objectKey: true, eventId: true },
  })

  let updated = 0
  const batchSize = 50

  for (let i = 0; i < photos.length; i += batchSize) {
    const batch = photos.slice(i, i + batchSize)

    await Promise.all(
      batch.map(async (photo) => {
        const thumbKey = `events/${photo.eventId}/thumb/${photo.id}.jpg`

        const [url, thumbUrl] = await Promise.all([
          getSignedViewUrl(photo.objectKey, 60 * 60 * 24 * 7),
          getSignedViewUrl(thumbKey, 60 * 60 * 24 * 7),
        ])

        await prisma.photo.update({
          where: { id: photo.id },
          data: { url, thumbUrl },
        })

        updated++
      }),
    )
  }

  return NextResponse.json({ ok: true, updated, total: photos.length })
}
