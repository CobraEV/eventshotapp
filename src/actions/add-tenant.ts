'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { auth } from '@/lib/auth'

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

type AddTenantInput = {
  company: string | null
  name: string
  email: string
  password: string
}

type AddTenantResult = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<'email' | 'name' | 'password', string>>
}

export async function addTenant(
  input: AddTenantInput
): Promise<AddTenantResult> {
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const password = input.password

  const fieldErrors: AddTenantResult['fieldErrors'] = {}

  if (!name) fieldErrors.name = 'Name ist erforderlich.'
  if (!isEmail(email)) fieldErrors.email = 'Ungültige E-Mail-Adresse.'
  if (!password || password.length < 8)
    fieldErrors.password = 'Passwort muss mindestens 8 Zeichen haben.'

  if (Object.keys(fieldErrors).length) {
    return { ok: false, fieldErrors, message: 'Bitte Eingaben prüfen.' }
  }

  // ❌ Tenant darf noch nicht existieren
  const existingTenant = await prisma.tenant.findUnique({
    where: { email },
    select: { id: true },
  })

  if (existingTenant) {
    return {
      ok: false,
      fieldErrors: { email: 'Diese E-Mail ist bereits registriert.' },
      message: 'E-Mail bereits vergeben.',
    }
  }

  try {
    // 1️⃣ User anlegen (better-auth)
    const signUp = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        callbackURL: '/login',
      },
    })

    if (!signUp?.user) {
      return {
        ok: false,
        message: 'Benutzer konnte nicht erstellt werden.',
      }
    }

    // 2️⃣ Tenant anlegen
    await prisma.tenant.create({
      data: {
        company: input.company,
        name,
        email,
      },
    })

    return {
      ok: true,
      message: 'account_created',
    }
  } catch (err) {
    console.error('addTenant error', err)

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
      message: 'Unerwarteter Fehler beim Erstellen des Accounts.',
    }
  }
}
