"use client"

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { logger } from "@/lib/logger"

export function EmbeddedStripeForm({
  clientSecret,
}: Readonly<{
  clientSecret: string
}>) {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!stripePublicKey) {
    logger.error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env var")
    return (
      <div>
        Missing <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> environment
        variable, unable to display the checkout form.
      </div>
    )
  }

  const stripePromise = loadStripe(stripePublicKey)

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
