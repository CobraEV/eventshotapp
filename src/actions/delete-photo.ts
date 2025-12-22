'use server'

import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function deletePhoto({
  id,
  eventId,
}: {
  id: string
  eventId: string
}) {
  // 1️⃣ Foto laden & absichern
  const photo = await prisma.photo.findFirst({
    where: {
      id,
      eventId,
    },
    select: {
      id: true,
      bucket: true,
      objectKey: true,
    },
  })

  if (!photo) {
    // idempotent: nichts zu tun
    return { success: true }
  }

  // 2️⃣ Objekt aus MinIO / S3 löschen
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: photo.bucket,
        Key: photo.objectKey,
      })
    )
  } catch (err) {
    // bewusst nicht hart abbrechen → DB-Cleanup trotzdem
    console.error('[delete-photo] Failed to delete object from S3', err)
  }

  // 3️⃣ DB-Eintrag löschen
  await prisma.photo.delete({
    where: {
      id: photo.id,
    },
  })

  return { success: true }
}
