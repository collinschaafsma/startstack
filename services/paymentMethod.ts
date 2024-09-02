import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { lower, paymentMethods, users } from "@/drizzle/schema"
import { logger } from "@/lib/logger"
import { stripe } from "@/lib/stripe"

/**
 * Payment Method Service
 *
 * Handles the attachment of Stripe payment methods to user accounts.
 *
 **/
export const paymentMethod = {
  /**
   * Attach
   *
   * This function is used to attach a payment method to a user account.
   *
   * @param {string} paymentMethodId - The ID of the payment method to attach.
   * @param {number} retryCount - The number of times to retry the attachment (used internally for retries).
   * @param {number} maxRetries - The maximum number of retries to attempt (used internally for retries).
   * @link https://docs.stripe.com/api/events/types#event_types-payment_method.attached
   **/
  async attach({
    paymentMethodId,
    retryCount = 0,
    maxRetries = 3,
  }: {
    paymentMethodId: string
    retryCount?: number
    maxRetries?: number
  }) {
    try {
      const data = await stripe.paymentMethods.retrieve(paymentMethodId)

      let paymentMethodEmail = data.billing_details.email?.toLowerCase()

      if (!paymentMethodEmail) {
        // the customer might be using the billing portal to update their payment method
        // and we don't have the email on the payment method, lets attempt to get it via the customer id
        if (data.customer && typeof data.customer === "string") {
          const customer = await db.query.customers.findFirst({
            where: (customers, { eq }) =>
              eq(customers.stripeCustomerId, String(data.customer)),
            with: {
              user: {
                columns: {
                  email: true,
                },
              },
            },
          })

          if (customer?.user?.email) {
            paymentMethodEmail = customer.user.email
          }
        }
      }

      if (!paymentMethodEmail) {
        logger.info(
          "no email on payment method, unable to attach paymentMethod to user"
        )
        return
      }

      // check if we have a user with the same email that we can attach the payment method to
      const existingUser = await db.query.users.findFirst({
        columns: {
          id: true,
        },
        where: eq(lower(users.email), paymentMethodEmail.toLowerCase()),
      })

      if (existingUser) {
        await db.insert(paymentMethods).values({
          id: data.id,
          userId: existingUser.id,
          brand: data.card?.display_brand ?? "unknown",
          last4: data.card?.last4 ?? "xxxx",
          expMonth: data.card?.exp_month ?? 0,
          expYear: data.card?.exp_year ?? 0,
        })

        return
      }

      if (retryCount < maxRetries) {
        logger.info(
          "no user found to attach payment info to, retrying in 3 seconds",
          { retryCount, maxRetries }
        )
        await new Promise(resolve => setTimeout(resolve, 3000))
        await paymentMethod.attach({
          paymentMethodId,
          retryCount: retryCount + 1,
        })
      } else {
        logger.info(
          "no user found to attach payment info to, max retries reached",
          { retryCount, maxRetries }
        )
      }
    } catch (error) {
      logger.error("[paymentMethod][attach]", { error })
      return
    }
  },
}
