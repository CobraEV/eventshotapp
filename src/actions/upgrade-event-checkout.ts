'use server'

import { PLAN_PRICES, getStripe } from '@/lib/stripe'
import { PLAN } from '@/generated/prisma/enums'

export async function upgradeEventCheckout({
  eventId,
  plan,
}: {
  eventId: string
  plan: PLAN
}) {
  const stripe = getStripe() // 🔑 Runtime only

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'twint'],
    line_items: [
      {
        price_data: {
          currency: 'chf',
          product_data: {
            name: `EventShot Upgrade – ${plan}`,
          },
          unit_amount: PLAN_PRICES[plan],
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'UPGRADE_EVENT',
      eventId,
      plan,
    },
    success_url: process.env.STRIPE_SUCCESS_URL!,
    cancel_url: process.env.STRIPE_CANCEL_URL!,
  })

  return { url: session.url! }
}
