import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { subscriptions, SubscriptionStatus } from "@/drizzle/schema"
import { logger } from "@/lib/logger"
import { stripe } from "@/lib/stripe"

/**
 * Subscription Service
 *
 * Manages Stripe subscription data.
 *
 * @link https://docs.stripe.com/api/subscriptions/object
 **/
export const subscription = {
  /**
   * List
   *
   * This function is used to list all active subscriptions in a given date range.
   *
   * @param {Date} from - The date to list subscriptions from.
   * @param {Date} to - The date to list subscriptions to.
   * @returns {Promise<Subscription[]>} - A promise that resolves to an array of subscriptions.
   **/
  async list({
    // default to a year ago
    from = new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    // default to now
    to = new Date(),
  }: {
    from: Date
    to?: Date
  }) {
    return await db.query.subscriptions.findMany({
      where: (subscription, { eq, and, between }) =>
        and(
          between(subscription.created, from, to),
          eq(subscription.status, "active")
        ),
      with: {
        price: true,
      },
    })
  },
  /**
   * Update
   *
   * This function is used to update a subscription by its ID based on the latest data from Stripe.
   *
   * @param {string} subscriptionId - The ID of the subscription to update.
   * @returns {Promise<void>} - This function does not return anything.
   **/
  async update({ subscriptionId }: { subscriptionId: string }) {
    try {
      // retrieve the subscription from stripe to ensure we have the latest data
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      const reshapedSubscription = {
        id: subscription.id,
        cancelAt: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000)
          : undefined,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : undefined,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        created: new Date(subscription.created * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        description: subscription.description,
        endedAt: subscription.ended_at
          ? new Date(subscription.ended_at * 1000)
          : undefined,
        priceId: subscription.items?.data[0].price?.id,
        quantity: subscription?.items.data[0].quantity,
        status: subscription.status as SubscriptionStatus,
        trialEnd: subscription?.trial_end
          ? new Date(subscription.trial_end * 1000)
          : undefined,
        trialStart: subscription?.trial_start
          ? new Date(subscription.trial_start * 1000)
          : undefined,
      }

      await db
        .update(subscriptions)
        .set(reshapedSubscription)
        .where(eq(subscriptions.id, subscriptionId))
    } catch (error) {
      logger.error("[subscription][update]", { error })
    }
  },
}
