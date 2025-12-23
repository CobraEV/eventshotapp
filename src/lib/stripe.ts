import Stripe from 'stripe'

let stripe: Stripe | null = null

export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }

    stripe = new Stripe(key, {
      apiVersion: '2025-12-15.clover',
    })
  }

  return stripe
}

export const PLAN_PRICES = {
  BASIC: 1,
  PREMIUM: 14900,
  ENTERPRISE: 19900,
} as const
