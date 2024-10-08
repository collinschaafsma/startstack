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
  /**
   * MRR Chart
   *
   * This function calculates the MRR Growth chart data since a given date.
   * It fetches active subscriptions and calculates the total mrr for each month.
   *
   * @param {Date} sinceDate - The date to calculate MRR Growth for.
   * @returns {Promise<Array<{ month: string; mrr: number }>>} - The calculated MRR Growth chart data.
   */
  async mrrChart(sinceDate: Date) {
    const subscriptions = await subscription.list({
      sinceDate,
    })

    return subscriptions
      .sort((a, b) => a.created.getTime() - b.created.getTime())
      .reduce(
        (acc, subscription) => {
          const date = new Date(subscription.created)
          const monthKey = new Date(0, Number(date.getMonth())).toLocaleString(
            "default",
            {
              month: "short",
            }
          )

          let monthlyAmount = (subscription.price.unitAmount ?? 0) / 100 // Convert cents to dollars
          if (subscription.price.interval === "year") {
            monthlyAmount /= 12 // Convert yearly to monthly
          }
          const previousMRR = acc[acc.length - 1]?.mrr ?? 0
          const newMRR = previousMRR + monthlyAmount

          const existingIndex = acc.findIndex(item => item.month === monthKey)

          if (existingIndex !== -1) {
            acc[existingIndex].mrr = Number(newMRR.toFixed(2))
          } else {
            acc.push({ month: monthKey, mrr: Number(newMRR.toFixed(2)) })
          }

          return acc
        },
        [] as Array<{ month: string; mrr: number }>
      )
  },
}
