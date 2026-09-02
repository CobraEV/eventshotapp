'use server'

import { PLAN } from '@/generated/prisma/enums'
import { requireTenantAction } from '@/lib/auth-guard'
import { PLAN_PRICES, getStripe } from '@/lib/stripe'

const PLAENE: PLAN[] = ['BASIC', 'PREMIUM', 'ENTERPRISE']

export async function createEventCheckout(data: {
  name: string
  location?: string
  description?: string
  date: string
  plan: PLAN
}) {
  // Die tenantId kam bisher vom Client und wanderte unveraendert in die
  // Stripe-Metadaten — der Webhook legt das Event spaeter fuer genau diesen
  // Tenant an. Sie gehoert aus der Session, nicht aus dem Formular.
  const guard = await requireTenantAction()
  if (!guard.ok) {
    return { ok: false as const, message: guard.message }
  }

  // Der Preis kommt ohnehin aus PLAN_PRICES auf dem Server. Der Plan selbst
  // wird trotzdem geprueft: ein unbekannter Wert ergaebe unit_amount
  // undefined und damit einen Stripe-Fehler mitten im Bezahlvorgang.
  if (!PLAENE.includes(data.plan)) {
    return { ok: false as const, message: 'Unbekanntes Paket.' }
  }

  const stripe = getStripe() // 🔑 Runtime only

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    // payment_method_types: ['card', 'twint', 'klarna'],
    allow_promotion_codes: true,
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
      tenantId: String(guard.tenant.id),
      name: data.name,
      location: data.location ?? '',
      description: data.description ?? '',
      date: data.date,
      plan: data.plan,
    },
    success_url: process.env.STRIPE_SUCCESS_URL!,
    cancel_url: process.env.STRIPE_CANCEL_URL!,
  })

  return { ok: true as const, url: session.url! }
}
