import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export const PLAN_PRICES = {
  BASIC: 9900, // CHF 99.-
  PREMIUM: 14900, // CHF 149.-
  ENTERPRISE: 19900, // CHF 199.-
} as const
