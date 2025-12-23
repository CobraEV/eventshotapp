import nodemailer from 'nodemailer'
import type { SendMailOptions } from 'nodemailer'

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT ?? 465)
const secure = process.env.SMTP_SECURE === 'true'
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const defaultFrom = process.env.SMTP_FROM ?? process.env.SMTP_USER

if (!host || !user || !pass) {
  throw new Error('SMTP configuration missing in environment variables.')
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user,
    pass,
  },
})

export async function sendMail(options: SendMailOptions) {
  return transporter.sendMail({
    from: defaultFrom,
    ...options,
  })
}
