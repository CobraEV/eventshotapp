'use server'

import { PLAN_PRICES, getStripe } from '@/lib/stripe'
import { PLAN } from '@/generated/prisma/enums'

export async function createEventCheckout(data: {
  tenantId: number
  name: string
  location?: string
  description?: string
  date: string
  plan: PLAN
}) {
  const stripe = getStripe() // 🔑 Runtime only

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'twint', 'klarna'],
    line_items: [
      {
        price_data: {
          currency: 'chf',
          product_data: {
            name: `EventShot – ${data.plan}`,
          },
          unit_amount: PLAN_PRICES[data.plan],
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'CREATE_EVENT',
      tenantId: String(data.tenantId),
      name: data.name,
      location: data.location ?? '',
      description: data.description ?? '',
      date: data.date,
      plan: data.plan,
    },
    success_url: process.env.STRIPE_SUCCESS_URL!,
    cancel_url: process.env.STRIPE_CANCEL_URL!,
  })

  return { url: session.url! }
}
