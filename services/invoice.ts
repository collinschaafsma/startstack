import "server-only"
import { cache } from "react"
import { stripe } from "@/lib/stripe"

/**
 * Invoice Service
 *
 * Manages invoice data.
 *
 **/
export const invoice = {
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
      range,
      limit = 10,
    }: {
      range: { from: Date; to: Date }
      limit?: number
    }) => {
      const invoices = await stripe.invoices.list({
        created: {
          gte: Math.floor(range.from.getTime() / 1000),
          lte: Math.floor(range.to.getTime() / 1000),
        },
        limit,
        status: "paid",
        expand: ["data.customer"],
      })
      return invoices.data
    }
  ),
}
