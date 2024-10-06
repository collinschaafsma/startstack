import Stripe from "stripe"
import { stripe } from "@/lib/stripe"

/**
 * Analytic Service
 *
 * Provides analytics for the dashboard
 *
 * @module
 */
export const analytic = {
  /**
   * Calculate MRR
   *
   * This function calculates the MRR based on the provided timestamp.
   * It fetches active subscriptions and calculates the total revenue.
   *
   * @param {number} timestamp - The timestamp to calculate MRR for.
   * @returns {Promise<number>} - The calculated MRR.
   * @link https://docs.stripe.com/api/subscriptions/list
   */
  async mrr(timestamp: number) {
    const subscriptions = await stripe.subscriptions.list({
      status: "active",
      created: { lte: timestamp },
      expand: ["data.plan"],
    })

    const mrr = subscriptions.data.reduce((acc, subscription) => {
      const plan = subscription.items.data[0].plan as Stripe.Plan
      if (plan.interval === "month") {
        return acc + (plan.amount ?? 0)
      } else if (plan.interval === "year") {
        return acc + (plan.amount ?? 0) / 12
      }
      return acc
    }, 0)

    return Math.round(mrr / 100)
  },
}
