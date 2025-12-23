import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { magicLink } from 'better-auth/plugins'
import prisma from './prisma'
import { sendMail } from './mailer'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  advanced: {
    cookiePrefix: 'eventshot',
  },

  trustedOrigins: async () => {
    const baseOrigins = ['http://localhost:3000', 'https://eventshot.ch']
    return baseOrigins
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        // Tenant anhand der Email finden
        const tenant = await prisma.tenant.findFirst({
          where: { email },
        })
        if (!tenant) {
          throw new Error('Kein Tenant für diese E-Mail gefunden.')
        }

        const confirmUrl = `${
          process.env.BETTER_AUTH_URL
        }/auth/confirm?token=${encodeURIComponent(token)}`

        // ✉️ Mail versenden
        await sendMail({
          to: email,
          subject: 'Dein Login-Link für EventShot',
          html: `
            <!DOCTYPE html>
            <html lang="de">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>EventShot Login</title>
              <style>
                body {
                  font-family: 'Inter', Arial, sans-serif;
                  background-color: #f7f7f9;
                  color: #111827;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 480px;
                  margin: 40px auto;
                  background: #ffffff;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
                }
                .header {
                  background: linear-gradient(135deg, #F54900, #ff7a33);
                  color: white;
                  padding: 28px 32px;
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 22px;
                  letter-spacing: 0.3px;
                }
                .content {
                  padding: 32px;
                  line-height: 1.6;
                  font-size: 15px;
                }
                .content p {
                  margin: 12px 0;
                }
                .button {
                  display: inline-block;
                  margin: 20px 0;
                  background-color: #F54900;
                  color: #fff !important;
                  text-decoration: none;
                  padding: 12px 22px;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 15px;
                  transition: background 0.2s ease-in-out;
                }
                .button:hover {
                  background-color: #d94000;
                }
                .footer {
                  font-size: 13px;
                  color: #6b7280;
                  padding: 20px 32px 32px;
                  text-align: center;
                  border-top: 1px solid #e5e7eb;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>EventShot</h1>
                </div>
                <div class="content">
                  <p>Hallo ${tenant.name},</p>
                  <p>du möchtest dich bei <strong>EventShot</strong> anmelden. Klicke einfach auf den folgenden Button, um dich einzuloggen:</p>
                  <p style="text-align: center;">
                    <a href="${confirmUrl}" class="button">Jetzt anmelden</a>
                  </p>
                  <p>Dieser Login-Link ist nur für dich bestimmt und aus Sicherheitsgründen nur kurz gültig.</p>
                  <p>Wenn du diese Anfrage nicht selbst gestellt hast, kannst du diese E-Mail einfach ignorieren.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} EventShot — Fotos. Emotionen. Momente.</p>
                </div>
              </div>
            </body>
            </html>
            `,
        })
      },
    }),

    nextCookies(),
  ],
})
