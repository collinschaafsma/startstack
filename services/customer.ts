import { between, count } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { customers } from "@/drizzle/schema"

/**
 * Customer
 *
 * This object contains methods for interacting with the customers table.
 */
export const customer = {
  /**
   * List
   *
   * This function lists customers within a given date range.
   */
  list: async ({
    range,
    limit = 10,
  }: {
    range: { from: Date; to: Date }
    limit?: number
  }) => {
    return await db.query.customers.findMany({
      where: (customer, { between }) =>
        between(customer.created, range.from, range.to),
      with: {
        user: true,
      },
      limit,
    })
  },
  /**
   * Count
   *
   * This function counts the customers within a given date range.
   */
  count: async (range: { from: Date; to: Date }) => {
    return await db
      .select({ count: count() })
      .from(customers)
      .where(between(customers.created, range.from, range.to))
  },
}
