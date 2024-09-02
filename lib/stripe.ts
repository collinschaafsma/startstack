import "server-only"
import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}

/**
 * Stripe Client (node / server side)
 *
 * @link https://docs.stripe.com/api?lang=node
 **/
export const stripe = new Stripe(stripeSecretKey)
