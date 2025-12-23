'use server'

import { auth } from '@/lib/auth'

export async function resetPassword(token: string, newPassword: string) {
  if (!token) {
    return { error: 'Kein gültiger Token übergeben.' }
  }

  if (!newPassword || newPassword.length < 6) {
    return { error: 'Das Passwort muss mindestens 6 Zeichen lang sein.' }
  }

  try {
    const result = await auth.api.resetPassword({
      body: {
        token,
        newPassword,
      },
    })

    return { success: true, result }
  } catch (err) {
    console.error('[resetPassword] Fehler:', err)
    return {
      error:
        'Fehler beim Zurücksetzen des Passworts. Token evtl. ungültig oder abgelaufen.',
    }
  }
}
