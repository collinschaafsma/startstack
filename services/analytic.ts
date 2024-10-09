import { unstable_cache as ioCache } from "next/cache"
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
  async mrr(range: { from: Date; to: Date }) {
    const subscriptions = await subscription.list(range)

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
   * MRR Growth
   *
   * This function calculates the MRR Growth monthly.
   * It fetches active subscriptions and calculates the total mrr for each month.
   *
   * @param {Date} sinceDate - The date to calculate MRR Growth for.
   * @returns {Promise<Array<{ month: string; mrr: number }>>} - The calculated MRR Growth chart data.
   */
  async mrrGrowth(range: { from: Date; to: Date }) {
    const subscriptions = await subscription.list(range)

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
  /**
   * Page Views
   *
   * This function calculates the page views for the dashboard.
   * It fetches the page views from a posthog insight and returns the data.
   *
   * @returns {Promise<Array<{ month: string; pageViews: number }>>} - The calculated page views chart data.
   */
  pageViews: ioCache(
    async (range: { from: Date; to: Date }) => {
      if (
        !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID ||
        !process.env.NEXT_PUBLIC_POSTHOG_PERSONAL_KEY
      ) {
        return []
      }

      const trendsParams = new URLSearchParams()
      trendsParams.append(
        "events",
        JSON.stringify([
          {
            id: "$pageview",
            math: "dau",
          },
        ])
      )
      trendsParams.append("display", "ActionsLineGraph")
      trendsParams.append("date_to", range.to.toISOString())
      trendsParams.append("date_from", range.from.toISOString())

      const projectId = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID
      const trendsUrl = `https://us.posthog.com/api/projects/${projectId}/insights/trend?${trendsParams}`

      const trendsRequest = await fetch(trendsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_PERSONAL_KEY}`,
        },
      })
      const trendsResponse = await trendsRequest.json()

      const dataPoints = trendsResponse.result[0].data
      const labels = trendsResponse.result[0].labels

      return dataPoints.map((point: number, index: number) => {
        return {
          date: labels[index],
          pageViews: point,
        }
      })
    },
    ["pageViews"],
    {
      revalidate: 8 * 60 * 60, // 8 hours
    }
  ),
}
