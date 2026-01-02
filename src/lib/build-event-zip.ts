import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import archiver from 'archiver'
import { Upload } from '@aws-sdk/lib-storage'
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import pLimit from 'p-limit'
import { PassThrough } from 'stream'

function calcProgress(done: number, total: number) {
  return Math.floor((done / total) * 100)
}

async function waitForS3Object(key: string, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: key,
        })
      )
      return
    } catch {
      await new Promise((r) => setTimeout(r, 300))
    }
  }

  throw new Error('ZIP not available in S3')
}

export async function buildEventZip(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { photos: true },
  })

  if (!event) throw new Error('Event not found')

  await prisma.event.update({
    where: { id: eventId },
    data: {
      zipBuilding: true,
      zipProgress: 0,
    },
  })

  const zipKey = `zips/event-${event.id}.zip`

  const zipStream = new PassThrough()
  const archive = archiver('zip', {
    zlib: { level: 6 },
  })
  archive.pipe(zipStream)

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET!,
      Key: zipKey,
      Body: zipStream,
      ContentType: 'application/zip',
    },
  })

  const limit = pLimit(5)
  let processed = 0
  let lastProgress = 0
  const total = event.photos.length

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

        processed++

        const progress = calcProgress(processed, total)

        if (progress !== lastProgress) {
          lastProgress = progress
          prisma.event
            .update({
              where: { id: eventId },
              data: { zipProgress: progress },
            })
            .catch(console.error)
        }
      })
    )
  )

  // UX: fast fertig
  await prisma.event.update({
    where: { id: eventId },
    data: { zipProgress: 98 },
  })

  await Promise.all([archive.finalize(), upload.done()])

  // 🔐 S3 consistency fix
  await waitForS3Object(zipKey)

  await prisma.event.update({
    where: { id: eventId },
    data: {
      zipReady: true,
      zipBuilding: false,
      zipProgress: 100,
      zipKey,
      zipUpdatedAt: new Date(),
    },
  })
}
