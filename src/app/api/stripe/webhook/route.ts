import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { PLAN } from '@/generated/prisma/enums'
import { getStripe } from '@/lib/stripe'
import { sendMail } from '@/lib/mailer'
import { generateInvoicePdf } from '@/lib/invoice-pdf'
import { saveInvoiceToMinio } from '@/lib/invoice-storage'
import { getNextInvoiceNumber } from '@/lib/invoice-number'
import {
  notifyAdminEventCreated,
  notifyAdminPayment,
} from '@/lib/admin-notify'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return new NextResponse('Missing signature', { status: 400 })
  }

  const stripe = getStripe()

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Invalid Stripe signature', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session

  if (session.metadata?.type !== 'CREATE_EVENT') {
    return NextResponse.json({ received: true })
  }

  // 🔒 Idempotenz: Event schon erstellt?
  const existing = await prisma.event.findUnique({
    where: { stripeSessionId: session.id },
  })

  if (existing) {
    return NextResponse.json({ received: true })
  }

  // 🎉 Event erstellen
  const createdEvent = await prisma.event.create({
    data: {
      tenantId: Number(session.metadata.tenantId),
      name: session.metadata.name,
      location: session.metadata.location || null,
      description: session.metadata.description || null,
      date: new Date(session.metadata.date),
      plan: session.metadata.plan as PLAN,
      stripeSessionId: session.id,
    },
  })

  // 🧾 Fortlaufende Rechnungsnummer (EventShot)
  const invoiceNumber = await getNextInvoiceNumber()

  // 📄 PDF erzeugen
  const pdf = await generateInvoicePdf({
    invoiceNumber,
    customerEmail: session.customer_details!.email!,
    eventName: createdEvent.name,
    plan: createdEvent.plan,
    amountCHF: session.amount_total! / 100,
    date: new Date(),
  })

  // ☁️ PDF in MinIO speichern
  const s3Key = `invoices/${invoiceNumber}.pdf`
  await saveInvoiceToMinio(pdf, s3Key)

  // ✉️ Kunden-Mail mit PDF
  await sendMail({
    to: session.customer_details!.email!,
    subject: 'Deine Rechnung – EventShot',
    html: `
      <p>Vielen Dank für deine Bestellung.</p>
      <p>Deine Rechnung ist beigefügt.</p>
      <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
    `,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: Buffer.from(pdf),
        contentType: 'application/pdf',
      },
    ],
  })

  // 📩 Betreiber-Benachrichtigungen (werfen nie – der Webhook darf dadurch
  // nicht fehlschlagen, sonst wiederholt Stripe und die Idempotenz-Sperre
  // verhindert den erneuten Rechnungsversand an den Kunden).
  await notifyAdminEventCreated({
    eventId: createdEvent.id,
    name: createdEvent.name,
    plan: createdEvent.plan,
    date: createdEvent.date,
    location: createdEvent.location,
    description: createdEvent.description,
    tenantId: createdEvent.tenantId,
    customerEmail: session.customer_details?.email,
    source: 'Self-Service (bezahlt)',
  })

  await notifyAdminPayment({
    amountCHF: (session.amount_total ?? 0) / 100,
    plan: createdEvent.plan,
    eventName: createdEvent.name,
    customerEmail: session.customer_details?.email,
    customerName: session.customer_details?.name,
    invoiceNumber,
    stripeSessionId: session.id,
  })

  return NextResponse.json({ received: true })
}
