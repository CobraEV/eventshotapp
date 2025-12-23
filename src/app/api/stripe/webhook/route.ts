import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { PLAN } from '@/generated/prisma/enums'
import { getStripe } from '@/lib/stripe'
import { sendMail } from '@/lib/mailer'
import { generateInvoicePdf } from '@/lib/invoice-pdf' // 🧾
import { saveInvoiceToMinio } from '@/lib/invoice-storage' // 🧾

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return new NextResponse('Missing signature', { status: 400 })

  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.metadata?.type === 'CREATE_EVENT') {
      const existing = await prisma.event.findUnique({
        where: { stripeSessionId: session.id },
      })

      if (!existing) {
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

        // 🧾 Rechnung
        const invoiceNumber = `INV-${Date.now()}`
        const pdf = await generateInvoicePdf({
          invoiceNumber,
          customerEmail: session.customer_details!.email!,
          eventName: createdEvent.name,
          plan: createdEvent.plan,
          amountCHF: session.amount_total! / 100,
          date: new Date(),
        })

        const s3Key = `invoices/${invoiceNumber}.pdf`
        await saveInvoiceToMinio(pdf, s3Key)

        // 🧾 Kunden-Mail
        await sendMail({
          to: session.customer_details!.email!,
          subject: 'Ihre Rechnung – EventShot',
          html: `
            <p>Vielen Dank für Ihre Bestellung.</p>
            <p>Ihre Rechnung finden Sie im Anhang.</p>
          `,
          attachments: [
            {
              filename: `${invoiceNumber}.pdf`,
              content: Buffer.from(pdf),
              contentType: 'application/pdf',
            },
          ],
        })

        // Admin-Mail (bestehend)
        await sendMail({
          to: 'info@edelbyte.ch',
          subject: `Neues Event – ${createdEvent.name}`,
          html: `Stripe Session: ${session.id}`,
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
