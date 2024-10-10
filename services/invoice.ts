import "server-only"
import { cache } from "react"
import { db } from "@/drizzle/db"
import { Invoice, invoices } from "@/drizzle/schema"
import { logger } from "@/lib/logger"
import { stripe } from "@/lib/stripe"

/**
 * Invoice Service
 *
 * Manages invoice data.
 *
 **/
export const invoice = {
  /**
   * Upsert
   *
   * This function is used to upsert an invoice.
   *
   * @param {string} invoiceId - The id of the invoice to upsert.
   * @param {number} retryCount - The number of times to retry the upsert (used internally for retries).
   * @param {number} maxRetries - The maximum number of retries to attempt (used internally for retries).
   * @link https://docs.stripe.com/api/events/types#event_types-invoice.paid
   * @link https://docs.stripe.com/api/events/types#event_types-invoice.finalized
   **/
  async upsert({
    invoiceId,
    retryCount = 0,
    maxRetries = 3,
  }: {
    invoiceId: string
    retryCount?: number
    maxRetries?: number
  }) {
    try {
      // Stripe events can happen out of order, so we always retrieve the latest data from the API to ensure we have
      // the most up-to-date state
      const data = await stripe.invoices.retrieve(invoiceId)

      // Check if the customer ID is a string, if not, get the ID from the object
      const customerId =
        typeof data.customer === "string" ? data.customer : data.customer?.id

      // If the customer ID is not found, log an error and return
      if (!customerId) {
        logger.error("[invoice][upsert] Customer ID not found")
        return
      }

      // Check if we have the customer yet
      const existingCustomer = await db.query.customers.findFirst({
        where: (customers, { eq }) =>
          eq(customers.stripeCustomerId, customerId),
      })

      // Check if we have an existing payment intent, if given a payment intent
      let existingPaymentIntent = null
      if (data.payment_intent) {
        const paymentIntentId =
          typeof data.payment_intent === "string"
            ? data.payment_intent
            : data.payment_intent?.id
        existingPaymentIntent = await db.query.paymentIntents.findFirst({
          where: (paymentIntents, { eq }) =>
            eq(paymentIntents.id, paymentIntentId),
        })
      }

      // Check if we have an existing subscription, if given a subscription
      let existingSubscription = null
      if (data.subscription) {
        const subscriptionId =
          typeof data.subscription === "string"
            ? data.subscription
            : data.subscription?.id
        existingSubscription = await db.query.subscriptions.findFirst({
          where: (subscriptions, { eq }) =>
            eq(subscriptions.id, subscriptionId),
        })
      }

      if (existingCustomer && (existingPaymentIntent || existingSubscription)) {
        // Get the userId from the customer
        const userId = existingCustomer.userId

        const invoiceData: Invoice = {
          id: data.id,
          amountDue: data.amount_due,
          amountPaid: data.amount_paid,
          amountRemaining: data.amount_remaining,
          created: new Date(data.created * 1000),
          hostedInvoiceUrl: data.hosted_invoice_url ?? null,
          invoiceNumber: data.number,
          invoicePdf: data.invoice_pdf ?? null,
          paymentIntentId: existingPaymentIntent
            ? typeof data.payment_intent === "string"
              ? data.payment_intent
              : (data.payment_intent?.id ?? null)
            : null,
          status: data.status as Invoice["status"],
          subscriptionId: existingSubscription
            ? typeof data.subscription === "string"
              ? data.subscription
              : (data.subscription?.id ?? null)
            : null,
          userId,
        }

        await db
          .insert(invoices)
          .values(invoiceData)
          .onConflictDoUpdate({ target: invoices.id, set: invoiceData })

        return
      }

      if (retryCount < maxRetries) {
        logger.info(
          "no user / customer found to associate invoice to, retrying in 3 seconds",
          { retryCount, maxRetries }
        )
        await new Promise(resolve => setTimeout(resolve, 3000))
        await invoice.upsert({ invoiceId, retryCount: retryCount + 1 })
      } else {
        logger.info(
          "no user / customer found to associate invoice to, max retries reached",
          { retryCount, maxRetries }
        )
      }
    } catch (error) {
      logger.error("[invoice][upsert]", { error })
    }
  },
  /**
   * List
   *
   * This function is used to list invoices.
   *
   * @param {Date} from - The date to list invoices from.
   * @param {Date} to - The date to list invoices to.
   * @returns {Promise<Invoice[]>} - A promise that resolves to an array of invoices.
   **/
  list: cache(
    async ({
      from = new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      to = new Date(),
    }: {
      from: Date
      to?: Date
    }) => {
      const invoices = await db.query.invoices.findMany({
        where: (invoice, { eq, and, between }) =>
          and(between(invoice.created, from, to), eq(invoice.status, "paid")),
      })
      return invoices
    }
  ),
}
