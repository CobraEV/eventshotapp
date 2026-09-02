'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'

/**
 * Ergebnis als Wert statt als Ausnahme: Next.js schwaerzt in Produktion die
 * Meldung geworfener Fehler ("An error occurred in the Server Components
 * render"). Ein `throw` haette dem Gast also nur "Fehler beim Upload"
 * gezeigt — nicht den Grund, den er wissen muss.
 */
export type CreateUploadUrlResult =
  | { ok: true; uploadUrl: string; objectKey: string }
  | { ok: false; message: string }

export async function createUploadUrl(
  eventId: string,
  mimeType: string,
): Promise<CreateUploadUrlResult> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { isActive: true, uploadLimit: true },
  })

  if (!event || !event.isActive) {
    return {
      ok: false,
      message: 'Dieses Event nimmt derzeit keine Fotos entgegen.',
    }
  }

  // Obergrenze hier pruefen, nicht erst beim Speichern: sonst laedt der Gast
  // sein Foto vollstaendig hoch und erfaehrt erst danach, dass es nicht
  // angenommen wird — Datenvolumen und Wartezeit fuer nichts.
  //
  // Bewusst ohne Transaktionssperre gegen gleichzeitige Uploads. Bei einem
  // Demo-Kontingent ist ein Ausreisser von ein, zwei Bildern folgenlos; eine
  // Sperre ueber den ganzen Upload-Vorgang waere der teurere Fehler.
  if (event.uploadLimit !== null) {
    const used = await prisma.photo.count({ where: { eventId } })
    if (used >= event.uploadLimit) {
      return {
        ok: false,
        message: `Dieses Demo-Event ist auf ${event.uploadLimit} Fotos begrenzt und voll.`,
      }
    }
  }

  const extension = mimeType.split('/')[1] ?? 'jpg'
  const objectKey = `events/${eventId}/original/${randomUUID()}.${extension}`

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET as string,
    Key: objectKey,
    ContentType: mimeType,
    CacheControl: 'public, max-age=31536000, immutable',
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

  return { ok: true, uploadUrl, objectKey }
}
