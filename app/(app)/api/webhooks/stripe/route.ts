import Stripe from "stripe"
import { event } from "@/services/event"
import { supportedStripeEvents } from "@/lib/constants"
import { logger } from "@/lib/logger"
import { stripe } from "@/lib/stripe"

/**
 * Stripe Webhook Event Handler
 *
 * This API endpoint processes incoming Stripe webhook events:
 * - Verifies the Stripe signature to ensure event authenticity
 * - Constructs the event object from the incoming payload
 * - Logs received events for monitoring and debugging
 * - Handles supported Stripe events (defined in supportedStripeEvents)
 * - Delegates event processing to the event handling service
 * - Logs unsupported events as warnings
 * @link https://docs.stripe.com/webhooks
 */
export async function POST(req: Request) {
  // 1. Get the signature from the headers
  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return new Response("No signature", { status: 400 })
  }

  // 2. Get the webhook secret
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return new Response("No webhook secret", { status: 500 })
  }

  // 3. Construct and handle the event
  const payload = await req.text()
  let constructedEvent: Stripe.Event

  try {
    constructedEvent = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    )

    logger.info("[stripe][webhook][event][received]", {
      type: constructedEvent.type,
      id: constructedEvent.id,
    })
  } catch (error) {
    logger.error("[stripe][webhook][constructedEvent]", { error })
    return new Response("Error", { status: 400 })
  }

  if (supportedStripeEvents.has(constructedEvent.type)) {
    logger.info("[stripe][webhook][event][supported]", {
      type: constructedEvent.type,
    })
    // handle the supported event
    await event.handle(constructedEvent)

    logger.info("[stripe][webhook][event][processed]", {
      type: constructedEvent.type,
    })
  } else {
    logger.warn("[stripe][webhook][event][unsupported]", {
      type: constructedEvent.type,
    })
  }

  return new Response(JSON.stringify({ received: true }))
}
