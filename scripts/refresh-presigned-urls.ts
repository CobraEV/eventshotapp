import 'dotenv/config'
import prisma from '@/lib/prisma'
import { getSignedViewUrl } from '@/lib/s3-presigned'

async function refreshPresignedUrls() {
  console.log('🔄 Refreshing presigned URLs for all photos...')

  const photos = await prisma.photo.findMany({
    where: {
      status: 'ready',
    },
    select: {
      id: true,
      objectKey: true,
      eventId: true,
    },
  })

  console.log(`📸 Found ${photos.length} photos to update`)

  let updated = 0
  const batchSize = 50

  for (let i = 0; i < photos.length; i += batchSize) {
    const batch = photos.slice(i, i + batchSize)

    await Promise.all(
      batch.map(async (photo) => {
        const thumbKey = `events/${photo.eventId}/thumb/${photo.id}.jpg`

        const [url, thumbUrl] = await Promise.all([
          getSignedViewUrl(photo.objectKey, 60 * 60 * 24 * 7), // 7 days
          getSignedViewUrl(thumbKey, 60 * 60 * 24 * 7), // 7 days
        ])

        await prisma.photo.update({
          where: { id: photo.id },
          data: { url, thumbUrl },
        })

        updated++
      }),
    )

    console.log(`✅ Updated ${updated}/${photos.length} photos`)
  }

  console.log('🎉 Done! All presigned URLs refreshed.')
}

refreshPresignedUrls()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
