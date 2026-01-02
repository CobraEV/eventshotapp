import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import archiver from 'archiver'
import { PassThrough } from 'stream'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { photos: true },
  })

  if (!event || event.photos.length === 0) {
    return new Response('No photos', { status: 404 })
  }

  // ZIP existiert bereits
  if (event.zipReady && event.zipKey) {
    return Response.json({ ready: true })
  }

  const zipKey = `zips/event-${eventId}.zip`

  const zipStream = new PassThrough()
  const archive = archiver('zip', {
    zlib: { level: 1 }, // 🚀 extrem schneller Modus
  })

  archive.pipe(zipStream)

  // ZIP async erzeugen
  ;(async () => {
    for (const [i, photo] of event.photos.entries()) {
      const obj = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: photo.objectKey,
        })
      )

      if (obj.Body) {
        archive.append(obj.Body as any, {
          name: `${event.name || 'event'}-${i + 1}.jpg`,
        })
      }
    }

    archive.finalize()
  })()

  // ZIP in S3 speichern
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: zipKey,
      Body: zipStream,
      ContentType: 'application/zip',
    })
  )

  // DB aktualisieren
  await prisma.event.update({
    where: { id: eventId },
    data: {
      zipKey,
      zipReady: true,
      zipUpdatedAt: new Date(),
    },
  })

  return Response.json({ ready: true })
}
