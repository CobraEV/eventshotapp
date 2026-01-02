import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import archiver from 'archiver'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { PassThrough } from 'stream'
import pLimit from 'p-limit'
import { AbortController } from 'abort-controller'

export async function GET(
  req: Request,
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
    zlib: { level: 0 }, // 🚀 fastest (Fotos sind bereits komprimiert)
  })

  archive.pipe(zipStream)

  const controller = new AbortController()

  req.signal.addEventListener('abort', () => {
    controller.abort()
    archive.destroy()
  })

  // 📦 ZIP sofort an Browser schicken
  const response = new Response(zipStream as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="EventShot_${event.name}.zip"`,
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  })

  // 🔁 ZIP asynchron füllen (wichtig: NICHT awaiten)
  ;(async () => {
    try {
      const limit = pLimit(6)

      const photos = [...event.photos].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )

      for (const photo of photos) {
        await limit(async () => {
          const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: photo.objectKey,
          })

          const obj = await s3.send(command, {
            abortSignal: controller.signal,
          })

          archive.append(obj.Body as any, {
            name: `${photo.originalName}`,
          })
        })
      }

      await archive.finalize()
    } catch (err) {
      archive.destroy(err as Error)
    }
  })()

  return response
}
