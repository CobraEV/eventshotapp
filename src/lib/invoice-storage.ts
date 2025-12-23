// lib/invoice-storage.ts
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '@/lib/s3'

export async function saveInvoiceToMinio(pdf: Uint8Array, key: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: pdf,
      ContentType: 'application/pdf',
    })
  )
}
