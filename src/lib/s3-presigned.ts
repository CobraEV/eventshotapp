import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '@/lib/s3'

export async function getSignedDownloadUrl(objectKey: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: objectKey,
  })

  const url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 Minuten
  })

  return url
}
