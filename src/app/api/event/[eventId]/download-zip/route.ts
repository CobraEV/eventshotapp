import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import archiver from 'archiver'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { PassThrough } from 'stream'
import pLimit from 'p-limit'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { photos: true },
  })

  if (!event) {
    return new Response('Event not found', { status: 404 })
  }

  const zipStream = new PassThrough()

  const archive = archiver('zip', {
    zlib: { level: 0 }, // 🚀 fastest
  })

  archive.pipe(zipStream)

  // 🔥 ZIP sofort starten (wichtig!)
  const response = new Response(zipStream as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="EventShot_${event.name}.zip"`,
    },
  })

  // ⬇️ ZIP-ERSTELLUNG ASYNCHRON (nicht await!)
  ;(async () => {
    try {
      const limit = pLimit(6) // parallel S3 streams

      await Promise.all(
        event.photos.map((photo) =>
          limit(async () => {
            const obj = await s3.send(
              new GetObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: photo.objectKey,
              })
            )

            archive.append(obj.Body as any, {
              name: photo.originalName,
            })
          })
        )
      )

      await archive.finalize()
    } catch (err) {
      archive.destroy(err as Error)
    }
  })()

  return response
}
