import "server-only"
import { and, eq } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { Price, prices, products } from "@/drizzle/schema"
import { logger } from "@/lib/logger"
import { stripe } from "@/lib/stripe"

/**
 * Price Service
 *
 * Manages price data.
 *
 **/
export const price = {
  /**
   * Get
   *
   * This function is used to retrieve a price by its ID.
   *
   * @param {string} priceId - The ID of the price to retrieve.
   * @returns {Promise<Price | undefined>} - The price object if found, otherwise undefined.
   **/
  async get({ priceId }: { priceId: string }) {
    try {
      return await db.query.prices.findFirst({
        columns: {
          id: true,
          currency: true,
          unitAmount: true,
          description: true,
          type: true,
          metadata: true,
        },
        where: and(eq(prices.id, priceId), eq(prices.active, true)),
      })
    } catch (error) {
      logger.error("[price][get]", { error })
      return undefined
    }
  },
  /**
   * Upsert
   *
   * This function is used to upsert a price by its ID.
   *
   * @param {string} priceId - The ID of the price to upsert.
   * @param {number} retryCount - The number of times to retry the upsert (used internally for retries).
   * @param {number} maxRetries - The maximum number of retries to attempt (used internally for retries).
   * @returns {Promise<void>} - This function does not return anything.
   **/
  async upsert({
    priceId,
    retryCount = 0,
    maxRetries = 3,
  }: {
    priceId: string
    retryCount?: number
    maxRetries?: number
  }) {
    try {
      const data = await stripe.prices.retrieve(priceId)

      const priceData: Price = {
        id: data.id,
        active: data.active,
        currency: data.currency,
        description: data.nickname,
        interval: data.recurring?.interval ?? null,
        intervalCount: data.recurring?.interval_count ?? null,
        metadata: data.metadata,
        productId:
          typeof data.product === "string" ? data.product : data.product.id,
        type: data.type,
        unitAmount: data.unit_amount ?? 0,
      }

      // check to see if the product exists
      const existingProduct = await db.query.products.findFirst({
        where: eq(products.id, priceData.productId),
      })

      if (existingProduct) {
        await db
          .insert(prices)
          .values(priceData)
          .onConflictDoUpdate({ target: prices.id, set: priceData })

        return
      }

      if (retryCount < maxRetries) {
        logger.info(
          "no product found to associate price to, retrying in 3 seconds",
          { retryCount, maxRetries }
        )
        await new Promise(resolve => setTimeout(resolve, 3000))
        await price.upsert({ priceId, retryCount: retryCount + 1 })
      } else {
        logger.info(
          "no product found to associate price to, max retries reached",
          { retryCount, maxRetries }
        )
      }
    } catch (error) {
      logger.error("[price][upsert]", { error })
    }
  },
  /**
   * Delete
   *
   * This function is used to delete a price by its ID.
   *
   * @param {string} priceId - The ID of the price to delete.
   * @returns {Promise<void>} - This function does not return anything.
   **/
  async delete({ priceId }: { priceId: string }) {
    try {
      await db.delete(prices).where(eq(prices.id, priceId))
    } catch (error) {
      logger.error("[price][delete]", { error })
    }
  },
}
