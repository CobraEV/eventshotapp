// lib/invoice-number.ts
import prisma from '@/lib/prisma'

export async function getNextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const key = `ES-${year}`

  const counter = await prisma.invoiceCounter.upsert({
    where: { key },
    update: {
      current: { increment: 1 },
    },
    create: {
      key,
      current: 1,
    },
  })

  return `${key}-${String(counter.current).padStart(6, '0')}`
}
