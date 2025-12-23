import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import prisma from '@/lib/prisma'
import { sendMail } from './mailer'

export const auth = betterAuth({
  // --------------------------------------------------
  // Base URL (SEHR WICHTIG in Prod)
  // --------------------------------------------------
  baseURL: process.env.BETTER_AUTH_URL,

  // --------------------------------------------------
  // Database
  // --------------------------------------------------
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // oder 'postgresql'
  }),

  // --------------------------------------------------
  // Cookies / Security
  // --------------------------------------------------
  advanced: {
    cookiePrefix: 'eventshot',
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookie: {
      domain:
        process.env.NODE_ENV === 'production' ? '.eventshot.ch' : undefined,
      sameSite: 'lax',
    },
  },

  // --------------------------------------------------
  // Email + Password Login
  // --------------------------------------------------
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    requireEmailVerification: true,

    // ---------------- RESET PASSWORD ----------------
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        from: 'EventShot <info@eventshot.ch>',
        to: user.email,
        subject: 'Passwort zurücksetzen – EventShot',
        text: `Hallo ${user.name || ''}

Du kannst dein Passwort über folgenden Link zurücksetzen:
${url}

Wenn du das nicht angefordert hast, ignoriere diese E-Mail.`,
        html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Passwort zurücksetzen</title>
</head>
<body style="background:#f5f5f5;padding:32px;font-family:Arial,sans-serif;">
  <div style="max-width:480px;margin:auto;background:#fff;border-radius:12px;padding:32px;">
    <h2>EventShot</h2>
    <p>Hallo ${user.name || '👋'},</p>
    <p>du kannst dein Passwort über folgenden Button zurücksetzen:</p>
    <p style="text-align:center;">
      <a href="${url}" style="background:#F54900;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
        Passwort zurücksetzen
      </a>
    </p>
    <p style="font-size:13px;color:#666;">
      Falls der Button nicht funktioniert:<br/>
      <span style="word-break:break-all">${url}</span>
    </p>
  </div>
</body>
</html>
        `,
      })
    },
  },

  // --------------------------------------------------
  // Email Verification
  // --------------------------------------------------
  emailVerification: {
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        from: 'EventShot <info@eventshot.ch>',
        to: user.email,
        subject: 'Bitte bestätige deine E-Mail-Adresse – EventShot',
        html: `
<!DOCTYPE html>
<html lang="de">
<body style="background:#f5f5f5;padding:32px;font-family:Arial,sans-serif;">
  <div style="max-width:480px;margin:auto;background:#fff;border-radius:12px;padding:32px;">
    <h2>EventShot</h2>
    <p>Hallo ${user.name || '👋'},</p>
    <p>bitte bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
    <p style="text-align:center;">
      <a href="${url}" style="background:#F54900;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
        E-Mail-Adresse bestätigen
      </a>
    </p>
    <p style="font-size:13px;color:#666;">
      Alternativ:<br/>
      <span style="word-break:break-all">${url}</span>
    </p>
  </div>
</body>
</html>
        `,
      })
    },

    // -------- AFTER VERIFICATION --------
    afterEmailVerification: async (user) => {
      const loginUrl =
        `${process.env.BETTER_AUTH_URL}/login` || 'http://localhost:3000/login'

      await sendMail({
        from: 'EventShot <info@eventshot.ch>',
        to: user.email,
        subject: 'Willkommen bei EventShot 🎉',
        html: `
<!DOCTYPE html>
<html lang="de">
<body style="background:#f5f5f5;padding:32px;font-family:Arial,sans-serif;">
  <div style="max-width:480px;margin:auto;background:#fff;border-radius:12px;padding:32px;">
    <h2>EventShot</h2>
    <p>Hallo ${user.name || '👋'},</p>
    <p>deine E-Mail-Adresse wurde erfolgreich bestätigt.</p>
    <p style="text-align:center;">
      <a href="${loginUrl}" style="background:#F54900;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
        Jetzt anmelden
      </a>
    </p>
  </div>
</body>
</html>
        `,
      })
    },
  },

  // --------------------------------------------------
  // Plugins
  // --------------------------------------------------
  plugins: [nextCookies()],
})
