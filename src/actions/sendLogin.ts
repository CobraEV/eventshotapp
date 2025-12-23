'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export const sendLogin = async (email: string) => {
  try {
    // --- 1. Validate email ---
    if (!email || !email.includes('@')) {
      return {
        ok: false,
        message: 'Bitte eine gültige E-Mail-Adresse eingeben.',
      }
    }

    const tenant = await prisma.tenant.findUnique({
      where: { email },
      select: { id: true, name: true }, // minimal fields
    })

    if (!tenant) {
      return {
        ok: false,
        message: 'Diese E-Mail-Adresse ist noch nicht registriert.',
      }
    }

    // --- 2. Determine callback URL (no subdomain anymore) ---
    const baseDomain = process.env.BASE_DOMAIN ?? ''
    if (!baseDomain) {
      console.error('❌ BASE_DOMAIN missing in environment')
      return {
        ok: false,
        message: 'Konfigurationsfehler: BASE_DOMAIN fehlt.',
      }
    }

    // Final callback → always same domain (flat)
    const callbackURL = `/tenant`

    // --- 3. Send magic link ---
    const result = await auth.api.signInMagicLink({
      body: {
        email,
        name: tenant.name,
        callbackURL,
      },
      headers: await headers(),
    })

    return {
      ok: true,
      message: 'Login-Link wurde gesendet.',
      result,
    }
  } catch (error: any) {
    console.error('❌ Error while sending magic link:', error)

    return {
      ok: false,
      message: 'Es gab ein Problem beim Versenden des Links.',
    }
  }
}
