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
   * This function is used to list all active subscriptions since a given date.
   *
   * @param {Date} sinceDate - The date to list subscriptions since.
   * @returns {Promise<Subscription[]>} - A promise that resolves to an array of subscriptions.
   **/
  async list({ sinceDate = new Date() }: { sinceDate: Date }) {
    return await db.query.subscriptions.findMany({
      where: (subscription, { gte, eq }) =>
        gte(subscription.created, sinceDate) &&
        eq(subscription.status, "active"),
      with: {
        price: true,
      },
    })
  },
  /**
   * Update
   *
   * This function is used to update a subscription by its ID.
   *
   * @param {string} subscriptionId - The ID of the subscription to update.
   * @returns {Promise<void>} - This function does not return anything.
   **/
  async update({ subscriptionId }: { subscriptionId: string }) {
    try {
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
