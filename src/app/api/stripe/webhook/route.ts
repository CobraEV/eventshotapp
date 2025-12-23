import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { PLAN } from '@/generated/prisma/enums'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return new NextResponse('Missing signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Webhook signature invalid', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.metadata?.type === 'CREATE_EVENT') {
      const existing = await prisma.event.findUnique({
        where: { stripeSessionId: session.id },
      })

      if (!existing) {
        await prisma.event.create({
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
      }
    }
  }

  return NextResponse.json({ received: true })
}
