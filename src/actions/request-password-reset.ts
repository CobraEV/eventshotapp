'use server'

import { auth } from '@/lib/auth'

export async function requestPasswordReset(email: string) {
  if (!email || typeof email !== 'string') {
    return { error: 'Bitte gib eine gültige E-Mail-Adresse ein.' }
  }

  try {
    const result = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`,
      },
    })

    // Better Auth gibt bei Erfolg ein Objekt zurück; Fehler werden geworfen
    return { success: true, result }
  } catch (err) {
    console.error('[requestPasswordReset] Fehler:', err)
    return {
      error: 'Fehler beim Senden der E-Mail. Bitte überprüfe die Adresse.',
    }
  }
}
