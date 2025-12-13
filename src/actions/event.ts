'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { PLAN } from '@/generated/prisma/enums'
import { Prisma } from '@/generated/prisma/client'

// --- Server Action: Event anlegen ---
export async function createEvent(formData: FormData) {
  console.log(formData)
  const tenantId = Number(formData.get('tenantId'))
  const name = String(formData.get('name') ?? '').trim()
  const plan = String(formData.get('plan') ?? '')
    .trim()
    .toUpperCase() as PLAN
  const description = String(formData.get('description') ?? '').trim() || null
  const location = String(formData.get('location') ?? '').trim() || null
  const date = new Date(String(formData.get('date')))
  // isActive is default true, but allow override if you want to add a toggle later

  const errs = new URLSearchParams()
  if (!name) errs.set('error', 'missing_name')
  if (!['BASIC', 'PREMIUM', 'ENTERPRISE'].includes(plan))
    errs.set('error', 'invalid_plan')
  if (!date) errs.set('error', 'missing_date')
  if ([...errs.keys()].length) redirect(`?${errs.toString()}`)
  const token = crypto.randomBytes(32).toString('hex')

  try {
    await prisma.event.create({
      data: {
        name,
        plan,
        description,
        location,
        date,
        isActive: true,
        tenant: { connect: { id: tenantId } },
      },
    })
    redirect(`?created=1`)
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      redirect(`?error=duplicate_name`)
    }
  }

  revalidatePath(`/`)
  revalidatePath(`/events`)
}

// --- Server Action: Event bearbeiten ---
export async function updateEvent(eventId: string, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim() || null
  const location = String(formData.get('location') ?? '').trim() || null
  const date = new Date(String(formData.get('date')))

  const errs = new URLSearchParams()
  if (!name) errs.set('error', 'missing_name')
  if ([...errs.keys()].length) redirect(`?${errs.toString()}`)

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        description,
        location,
        date,
      },
    })
    redirect(`?updated=1`)
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      redirect(`?error=duplicate_name`)
    }
    console.error('Event update error:', err)
  }

  revalidatePath(`/`)
  revalidatePath(`/events`)
}
