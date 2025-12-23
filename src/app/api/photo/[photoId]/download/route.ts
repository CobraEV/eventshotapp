import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'

export async function GET(
  _req: Request,
  context: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await context.params

  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    include: { event: true },
  })

  if (!photo) {
    return new NextResponse('Photo not found', { status: 404 })
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: photo.objectKey,
  })

  const response = await s3.send(command)

  if (!response.Body) {
    return new NextResponse('File not found', { status: 404 })
  }

  return new NextResponse(response.Body as any, {
    headers: {
      'Content-Type': response.ContentType ?? 'image/jpeg',
      'Content-Disposition': `attachment; filename="${photo.id}.jpg"`,
    },
  })
}
