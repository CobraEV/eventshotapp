import { GetObjectCommand } from '@aws-sdk/client-s3'
import archiver from 'archiver'
import pLimit from 'p-limit'
import { PassThrough } from 'stream'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'

function sanitizeFilename(name: string) {
  return name.replace(/[\/\\]/g, '_').replace(/[^\w.\-]+/g, '_')
}

function buildFilename(photo: {
  originalName: string
  mimeType: string
  createdAt: Date
}) {
  if (photo.originalName?.trim()) {
    return sanitizeFilename(photo.originalName)
  }

  const ext = photo.mimeType?.split('/')[1] ?? 'jpg'
  return `photo_${photo.createdAt.getTime()}.${ext}`
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      name: true,
      photos: {
        select: {
          objectKey: true,
          originalName: true,
          mimeType: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!event) {
    return new Response('Event not found', { status: 404 })
  }

  if (event.photos.length === 0) {
    return new Response('No photos', { status: 404 })
  }

  // 🔒 Optionaler Schutz
  if (event.photos.length > 5000) {
    return new Response('Too many photos', { status: 413 })
  }

  const zipStream = new PassThrough()
  const archive = archiver('zip', {
    zlib: { level: 0 }, // 🚀 fastest – Bilder sind schon komprimiert
  })

  archive.pipe(zipStream)

  const controller = new AbortController()

  req.signal.addEventListener('abort', () => {
    controller.abort()
    archive.abort()
  })

  const zipName = `EventShot_${event.name}.zip`

  const response = new Response(zipStream as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(
        zipName,
      )}`,
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  })

  // 🔁 ZIP asynchron füllen (Streaming!)
  ;(async () => {
    try {
      const limit = pLimit(6)

      const tasks = event.photos.map((photo) =>
        limit(async () => {
          const obj = await s3.send(
            new GetObjectCommand({
              Bucket: process.env.S3_BUCKET as string,
              Key: photo.objectKey,
            }),
            { abortSignal: controller.signal },
          )

          if (!obj.Body) return

          archive.append(obj.Body as any, {
            name: buildFilename(photo),
          })
        }),
      )

      await Promise.all(tasks)
      await archive.finalize()
    } catch (err) {
      archive.abort()
    }
  })()

  return response
}
