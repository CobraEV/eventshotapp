'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export const sendLogin = async (email: string) => {
  try {
    if (!email || !email.includes('@')) {
      return {
        ok: false,
        message: 'Bitte eine gültige E-Mail-Adresse eingeben.',
      }
    }

    const tenant = await prisma.tenant.findUnique({
      where: { email },
      select: { id: true, name: true },
    })

    if (!tenant) {
      return {
        ok: false,
        message: 'Diese E-Mail-Adresse ist noch nicht registriert.',
      }
    }

    // ❌ KEIN callbackURL mehr!
    await auth.api.signInMagicLink({
      body: {
        email,
        name: tenant.name,
      },
      headers: await headers(),
    })

    return {
      ok: true,
      message: 'Login-Link wurde gesendet.',
    }
  } catch (error) {
    console.error('❌ Error while sending magic link:', error)
    return {
      ok: false,
      message: 'Es gab ein Problem beim Versenden des Links.',
    }
  }
}
