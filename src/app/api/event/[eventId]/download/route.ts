import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import archiver from 'archiver'
import { PassThrough } from 'stream'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { photos: true },
  })

  if (!event || event.photos.length === 0) {
    return new NextResponse('No photos found', { status: 404 })
  }

  const zipStream = new PassThrough()
  const archive = archiver('zip', { zlib: { level: 9 } })

  archive.pipe(zipStream)

  for (const [index, photo] of event.photos.entries()) {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: photo.objectKey, // z.B. events/{eventId}/{file}.jpg
    })

    const response = await s3.send(command)

    if (!response.Body) continue

    archive.append(response.Body as any, {
      name: `${event.name || 'event'}-${index + 1}.jpg`,
    })
  }

  archive.finalize()

  return new NextResponse(zipStream as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="event-${event.id}.zip"`,
    },
  })
}
