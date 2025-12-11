'use server'

import prisma from '@/lib/prisma'

export async function checkEmailAvailable(email: string) {
  const e = email.trim().toLowerCase()

  // Basic validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    return { available: false, reason: 'invalid' as const }
  }

  // Check in database
  const exists = await prisma.tenant.findUnique({
    where: { email: e },
    select: { id: true },
  })

  return { available: !exists }
}
