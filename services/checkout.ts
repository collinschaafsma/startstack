import "server-only"
import { unstable_after as after } from "next/server"
import { eq } from "drizzle-orm"
import { Resend } from "resend"
import Stripe from "stripe"
import { db } from "@/drizzle/db"
import {
  CheckoutSessionMode,
  CheckoutSessionPaymentStatus,
  checkoutSessions,
  CheckoutSessionStatus,
  customers,
  lower,
  Metadata,
  paymentIntents,
  PaymentIntentStatus,
  subscriptions,
  SubscriptionStatus,
  users,
} from "@/drizzle/schema"
import { signIn } from "@/auth"
import captureEvent from "@/lib/capture-event"
import {
  allowPromotionCodes,
  baseUrl,
  resendAudienceId,
  resendEnabled,
} from "@/lib/constants"
import { logger } from "@/lib/logger"
import { stripe } from "@/lib/stripe"
import { currentUser } from "./currentUser"
import { price } from "./price"

/**
 * Checkout Service
 *
 * This service handles the creation and management of Stripe checkout sessions.
 *
 * @link https://docs.stripe.com/api/checkout/sessions/create
 * @link https://docs.stripe.com/api/events/types#event_types-checkout.session.completed
 * @link https://docs.stripe.com/api/checkout/sessions/retrieve
 **/
export const checkout = {
  sessions: {
    /**
     * Create
     *
     * This function is used to create a checkout session.
     *
     * @param {string} priceId - The id of the price to create the checkout session for.
     * @returns {Promise<{ status: "success" | "error", clientSecret: string | null }>} - The status and client secret of the checkout session.
     * @link https://docs.stripe.com/api/checkout/sessions/create
     */
    async create({ priceId }: { priceId: string }) {
      try {
        // 0. get the current user with the customer id if it exists
        const userWithCustomerId = await currentUser.customerId()

        // 1. Make sure the price exists, and is active
        const priceDetails = await price.get({ priceId })
        if (!priceDetails) {
          throw new Error(`Price not found for ${priceId}`)
        }

        // 2. Determine the mode of the checkout session based on the price type
        const mode =
          priceDetails.type === "recurring" ? "subscription" : "payment"

        // 2.a if the mode is subscription, make sure we have a user, if not redirect to the sign in page
        // subscriptions require a currentUser
        if (mode === "subscription" && !userWithCustomerId?.email) {
          return {
            status: "requiresSession",
            clientSecret: null,
          }
        }

        // 2.b check to see if the current user has a customerId, if not create a customer in stripe if mode is subscription
        let stripeCustomerId: string | undefined
        if (mode === "subscription") {
          if (!userWithCustomerId?.customerId) {
            // we should have a user by now, if not throw an error
            if (!userWithCustomerId?.email) {
              throw new Error("User with an email is required for subscription")
            }

            // create a new customer in stripe
            const customer = await stripe.customers.create({
              email: userWithCustomerId.email,
            })

            stripeCustomerId = customer.id // new customer id
          } else {
            stripeCustomerId = userWithCustomerId.customerId // existing customer id
          }
        } else {
          stripeCustomerId = userWithCustomerId?.customerId ?? undefined // existing customer id if we have one
        }

        // 3. Create a checkout session with stripe
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode,
          // if the mode is payment and we don't have a customer id, set the customer_creation mode to always, this happens by default for subscriptions
          ...(mode === "payment" &&
            !stripeCustomerId && { customer_creation: "always" }),
          // if the mode is payment, create an invoice, this happens by default for subscriptions
          // see: https://docs.stripe.com/receipts?payment-ui=checkout&ui=embedded-form#paid-invoices
          ...(mode === "payment" && { invoice_creation: { enabled: true } }),
          // if we have a customer id, set the customer to the stripe customer id
          ...(stripeCustomerId && { customer: stripeCustomerId }),
          // if we have a trialPeriodDays in the metadata, and the mode is subscription, set the trial settings
          ...(mode === "subscription" &&
            (priceDetails.metadata as Metadata)["trialPeriodDays"] && {
              subscription_data: {
                trial_settings: {
                  end_behavior: {
                    missing_payment_method: "cancel",
                  },
                },
                trial_period_days: parseInt(
                  (priceDetails.metadata as Metadata)["trialPeriodDays"]
                ),
              },
            }),
          // if we have a trialPeriodDays in the metadata, and the mode is subscription, set the payment method collection to if_required
          ...(mode === "subscription" &&
            (priceDetails.metadata as Metadata)["trialPeriodDays"] && {
              payment_method_collection: "if_required",
            }),
          ui_mode: "embedded",
          allow_promotion_codes: allowPromotionCodes,
          consent_collection: {
            promotions: "auto",
          },
          return_url: `${baseUrl}/checkout/thank-you?id={CHECKOUT_SESSION_ID}`,
        })

        // capture the event in posthog
        after(async () => {
          await captureEvent({
            event: "checkout_session_created",
            properties: {
              priceId,
              stripeCustomerId,
              sessionId: session.id,
            },
          })
        })

        return {
          status: "success",
          clientSecret: session.client_secret,
        }
      } catch (error) {
        logger.error("[checkout][create]", { error })
        return {
          status: "error",
          clientSecret: null,
        }
      }
    },
    /**
     * Get
     *
     * This function is used to get a checkout session.
     *
     * @param {string} sessionId - The id of the session to get.
     * @returns {Promise<{ status: "success" | "error", session: Stripe.Checkout.Session | undefined }>} - The status and session of the checkout session.
     * @link https://docs.stripe.com/api/checkout/sessions/retrieve
     */
    async get({ sessionId }: { sessionId: string }) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["line_items"],
        })

        return {
          status: "success",
          session,
        }
      } catch (error) {
        logger.error("[checkout][get]", { error })
        return {
          status: "error",
          session: undefined,
        }
      }
    },
    /**
     * Complete
     *
     * This function is used to complete a checkout session.
     *
     * @param {string} sessionId - The id of the session to complete.
     * @link https://docs.stripe.com/api/events/types#event_types-checkout.session.completed
     */
    async complete({ sessionId }: { sessionId: string }) {
      try {
        const data = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["line_items"],
        })

        // 0. check if the event is valid
        if (data.payment_status === "unpaid") {
          throw new Error(
            "Payment status is unpaid, checkout.session.completed processing halted."
          )
        }
        // 0.a make sure we got an email
        const email = data.customer_details?.email?.toLowerCase()
        if (!email) {
          throw new Error(
            "No email found, checkout.session.completed processing halted."
          )
        }

        // 0.b check if we have a stripe customer id
        const stripeCustomerId = data.customer?.toString()
        if (!stripeCustomerId) {
          throw new Error(
            "No stripe customer id found, checkout.session.completed processing halted."
          )
        }

        // 0.c check if we have a price id from the line items
        const priceId = data.line_items?.data[0].price?.id
        if (!priceId) {
          throw new Error(
            "No priceId found, checkout.session.completed processing halted."
          )
        }

        // 0.d check if the mode is payment that it has a payment intent
        if (data.mode === "payment" && !data.payment_intent) {
          throw new Error(
            "Mode is payment but no payment intent found, checkout.session.completed processing halted."
          )
        }

        // 0.e check if the mode is subscription that it has a subscription
        if (data.mode === "subscription" && !data.subscription) {
          throw new Error(
            "Mode is subscription but no subscription found, checkout.session.completed processing halted."
          )
        }

        let subscription: Stripe.Subscription | undefined
        let paymentIntent: Stripe.PaymentIntent | undefined

        // 1. get the subscription or payment intent details based on the mode from stripe
        if (data.mode === "subscription" && data.subscription) {
          subscription = await stripe.subscriptions.retrieve(
            data.subscription.toString()
          )
        } else if (data.mode === "payment" && data.payment_intent) {
          paymentIntent = await stripe.paymentIntents.retrieve(
            data.payment_intent.toString()
          )
        }

        let userId: string | undefined

        // 2. check if the user already exists by email
        // startstack uses the email as the unique identifier for users
        const existingUserId = (
          await db.query.users.findFirst({
            columns: {
              id: true,
            },
            where: eq(lower(users.email), email),
          })
        )?.id

        // 3. start the db transaction
        const successfulTransaction = await db.transaction(async tx => {
          // 3.a create the user record if it doesn't exist, this will default to the role of "user"
          userId =
            existingUserId ??
            (
              await tx
                .insert(users)
                .values({ email })
                .returning({ id: users.id })
            )[0].id

          if (!userId) {
            throw new Error("Failed to create user record")
          }

          // 3.b create the customer association
          await tx
            .insert(customers)
            .values({
              userId,
              stripeCustomerId,
            })
            .onConflictDoNothing()

          // 3.c create the payment intent or subscription based on the mode
          if (paymentIntent) {
            // create the payment intent record
            await tx.insert(paymentIntents).values({
              id: paymentIntent.id,
              description: paymentIntent.description,
              amount: paymentIntent.amount,
              status: paymentIntent.status as PaymentIntentStatus,
              userId,
            })
          } else if (subscription) {
            // create the subscription record
            await tx.insert(subscriptions).values({
              id: subscription.id,
              cancelAt: subscription.cancel_at
                ? new Date(subscription.cancel_at * 1000)
                : undefined,
              canceledAt: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000)
                : undefined,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              created: new Date(subscription.created * 1000),
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
              currentPeriodStart: new Date(
                subscription.current_period_start * 1000
              ),
              userId,
              description: subscription.description,
              endedAt: subscription.ended_at
                ? new Date(subscription.ended_at * 1000)
                : undefined,
              priceId,
              quantity: subscription?.items.data[0].quantity,
              status: subscription.status as SubscriptionStatus,
              trialEnd: subscription?.trial_end
                ? new Date(subscription.trial_end * 1000)
                : undefined,
              trialStart: subscription?.trial_start
                ? new Date(subscription.trial_start * 1000)
                : undefined,
            })
          }

          // 3.d create the checkout session
          await tx.insert(checkoutSessions).values({
            id: data.id,
            amountTotal: data.amount_total,
            amountSubtotal: data.amount_subtotal,
            mode: data.mode as CheckoutSessionMode,
            paymentIntentId: paymentIntent?.id,
            paymentStatus: data.payment_status as CheckoutSessionPaymentStatus,
            status: data.status as CheckoutSessionStatus,
            subscriptionId: subscription?.id,
            userId,
            priceId,
          })

          return true
        }) // end db transaction

        if (!successfulTransaction) {
          throw new Error(
            "Failed to process the transaction, checkout.session.completed processing halted."
          )
        }

        // add or remove the user from the newsletter based on the consent
        after(async () => {
          if (!resendEnabled || !resendAudienceId) {
            logger.warn("Resend is not enabled")
            return
          }

          const resend = new Resend(process.env.RESEND_API_KEY)

          if (data.consent?.promotions === "opt_in") {
            await resend.contacts.create({
              email,
              unsubscribed: false,
              audienceId: resendAudienceId,
            })
          }

          if (data.consent?.promotions === "opt_out") {
            await resend.contacts.remove({
              email,
              audienceId: resendAudienceId,
            })
          }
        })

        // 4. send the user a welcome email with a magic link if they are making a one time purchase
        // so that they can login and access the product
        if (data.mode === "payment") {
          await signIn("resend", {
            email,
            redirect: false,
            redirectTo: "/account",
          })
        }
      } catch (error) {
        logger.error("[checkout.session.complete]", {
          error,
        })
      }
    },
  },
}
