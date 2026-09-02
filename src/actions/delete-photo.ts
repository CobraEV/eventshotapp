'use server'

import { requireOwnedEventAction } from '@/lib/auth-guard'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { revalidatePath } from 'next/cache'

export async function deletePhoto({
  id,
  eventId,
}: {
  id: string
  eventId: string
}) {
  // 0️⃣ Gehoert das Event ueberhaupt dem Anrufer?
  //
  // Das findFirst({ id, eventId }) darunter ist eine Konsistenz-, keine
  // Berechtigungspruefung. Die Foto-IDs liefert getEventPhotos jedem Gast im
  // RSC-Payload der oeffentlichen Galerie, und eine Server Action ist ein
  // HTTP-Endpunkt: bis hierher konnte jeder Hochzeitsgast die komplette
  // Galerie loeschen — S3-Objekt und Datenbankzeile, ohne Papierkorb.
  //
  // Die Pruefung steht VOR dem idempotenten "nichts zu tun": sonst bekaeme
  // ein Fremder eine Erfolgsmeldung fuer ein Foto, das es gar nicht gibt.
  const guard = await requireOwnedEventAction(eventId, { id: true })
  if (!guard.ok) {
    return { success: false as const, message: guard.message }
  }

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
    return { success: true as const }
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

  revalidatePath(`/tenant/event/${eventId}`)
  revalidatePath(`/event/${eventId}`)

  return { success: true }
}
