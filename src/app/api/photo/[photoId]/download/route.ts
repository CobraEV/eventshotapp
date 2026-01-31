import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'

export async function GET(
  _req: Request,
  context: { params: Promise<{ photoId: string }> },
) {
  const { photoId } = await context.params

  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
  })

  if (!photo) {
    return new NextResponse('Photo not found', { status: 404 })
  }

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: photo.objectKey,
      ResponseContentDisposition: `attachment; filename="${photo.id}.jpg"`,
    }),
    { expiresIn: 60 },
  )

  return NextResponse.redirect(url)
}
