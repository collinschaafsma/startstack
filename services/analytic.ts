import { subscription } from "./subscription"

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
   * This function calculates the MRR based on the provided date.
   * It fetches active subscriptions and calculates the total revenue.
   *
   * @param {Date} sinceDate - The date to calculate MRR for.
   * @returns {Promise<number>} - The calculated MRR.
   * @link https://docs.stripe.com/api/subscriptions/list
   */
  async mrr(sinceDate: Date) {
    const subscriptions = await subscription.list({
      sinceDate,
    })

    const mrr = subscriptions.reduce((acc, subscription) => {
      if (subscription.price.interval === "month") {
        acc += subscription.price.unitAmount ?? 0
      } else if (subscription.price.interval === "year") {
        acc += (subscription.price.unitAmount ?? 0) / 12
      }
      return acc
    }, 0)

    // convert from cents to dollars with 2 decimal places
    return Number((mrr / 100).toFixed(2))
  },
}
