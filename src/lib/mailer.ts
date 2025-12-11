import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT ?? 465)
const secure = process.env.SMTP_SECURE === 'true' // true = 465
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const from = process.env.SMTP_FROM ?? process.env.SMTP_USER

if (!host || !user || !pass) {
  throw new Error('SMTP configuration missing in environment variables.')
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure, // Hosttech requires TLS on port 465
  auth: {
    user,
    pass,
  },
})

export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  from?: string
  to: string
  subject: string
  html: string
  text?: string
}) {
  return await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  })
}
