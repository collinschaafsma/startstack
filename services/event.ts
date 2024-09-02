import "server-only"
import Stripe from "stripe"
import { checkout } from "./checkout"
import { invoice } from "./invoice"
import { paymentMethod } from "./paymentMethod"
import { price } from "./price"
import { product } from "./product"
import { subscription } from "./subscription"

/**
 * Event Service
 *
 * Handles Stripe webhook events for various operations:
 * - Checkout session completion
 * - Subscription updates and deletions
 * - Payment method attachments
 * - Invoice finalization and payments
 * - Product and price creation, updates, and deletions
 * @link https://docs.stripe.com/api/events
 **/
export const event = {
  /**
   * Handle
   *
   * This function handles the Stripe webhook events.
   *
   * @param {Stripe.Event} constructedEvent - The constructed event from Stripe.
   * @returns {Promise<void>} - A promise that resolves when the event is handled.
   */
  handle: async (constructedEvent: Stripe.Event) => {
    switch (constructedEvent.type) {
      case "checkout.session.completed":
        const eventCheckout = constructedEvent.data
          .object as Stripe.Checkout.Session
        await checkout.sessions.complete({
          sessionId: eventCheckout.id,
        })
        break
      case "customer.subscription.deleted":
      case "customer.subscription.updated":
        const eventSubscription = constructedEvent.data
          .object as Stripe.Subscription
        await subscription.update({ subscriptionId: eventSubscription.id })
        break
      case "payment_method.attached":
        const eventPaymentMethod = constructedEvent.data
          .object as Stripe.PaymentMethod
        await paymentMethod.attach({ paymentMethodId: eventPaymentMethod.id })
        break
      case "invoice.finalized":
      case "invoice.paid":
        const eventInvoice = constructedEvent.data.object as Stripe.Invoice
        await invoice.upsert({ invoiceId: eventInvoice.id })
        break
      case "product.created":
      case "product.updated":
        const eventProduct = constructedEvent.data.object as Stripe.Product
        await product.upsert({
          productId: eventProduct.id,
        })
        break
      case "product.deleted":
        const eventProductForDelete = constructedEvent.data
          .object as Stripe.Product
        await product.delete({ productId: eventProductForDelete.id })
        break
      case "price.created":
      case "price.updated":
        const eventPrice = constructedEvent.data.object as Stripe.Price
        await price.upsert({ priceId: eventPrice.id })
        break
      case "price.deleted":
        const eventPriceForDelete = constructedEvent.data.object as Stripe.Price
        await price.delete({ priceId: eventPriceForDelete.id })
        break
      default:
        break
    }
  },
}
