'use server'

import prisma from '@/lib/prisma'

export async function finalizeUpload(params: {
  objectKey: string
  originalName: string
  size: number
}) {
  const { objectKey, originalName, size } = params

  await prisma.photo.update({
    where: { objectKey },
    data: {
      originalName,
      size,
    },
  })

  return { success: true }
}
