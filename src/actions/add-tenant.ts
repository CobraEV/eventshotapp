'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

type AddTenantInput = {
  company: string | null
  name: string
  email: string
  callbackPath?: string
}

type AddTenantResult = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<'email' | 'name', string>>
  callbackURL?: string
}

export async function addTenant(
  input: AddTenantInput
): Promise<AddTenantResult> {
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()

  const fieldErrors: AddTenantResult['fieldErrors'] = {}
  if (!name) fieldErrors.name = 'Name ist erforderlich.'
  if (!isEmail(email)) fieldErrors.email = 'Ungültige E-Mail.'
  if (Object.keys(fieldErrors).length)
    return { ok: false, fieldErrors, message: 'Bitte Eingaben prüfen.' }

  const exists = await prisma.tenant.findUnique({
    where: { email },
    select: { id: true },
  })

  if (exists)
    return {
      ok: false,
      fieldErrors: { email: 'Diese E-Mail ist bereits vergeben.' },
      message: 'E-Mail bereits vergeben.',
    }

  try {
    // create tenant
    await prisma.tenant.create({
      data: {
        company: input.company,
        name,
        email,
      },
    })

    const callbackURL = '/admin'

    // send magic link
    await auth.api.signInMagicLink({
      body: { email, callbackURL },
      headers: await headers(),
    })

    return { ok: true, message: 'magic_link_sent', callbackURL }
  } catch (err) {
    console.log(err)

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return {
        ok: false,
        message: 'E-Mail bereits vergeben.',
        fieldErrors: { email: 'Diese E-Mail ist bereits vergeben.' },
      }
    }

    return {
      ok: false,
      message: 'Unerwarteter Fehler.',
    }
  }
}
