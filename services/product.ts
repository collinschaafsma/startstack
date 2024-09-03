import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { prices, Product, products } from "@/drizzle/schema"
import { logger } from "@/lib/logger"
import { stripe } from "@/lib/stripe"

/**
 * Product Service
 *
 * Manages product data.
 *
 **/
export const product = {
  /**
   * Get All
   *
   * This function is used to retrieve all active products.
   * This is used to display the products on the marketing page.
   *
   * @returns {Promise<{ oneTimeProducts: Product[], recurringProducts: Product[] } | null>} - The products object if found, otherwise null.
   **/
  getAll: async () => {
    try {
      const productResults = await db.query.products.findMany({
        columns: {
          id: true,
          description: true,
          name: true,
          marketingFeatures: true,
          metadata: true,
        },
        where: eq(products.active, true),
        with: {
          prices: {
            columns: {
              id: true,
              type: true,
              interval: true,
              currency: true,
              unitAmount: true,
              description: true,
              metadata: true,
            },
            where: eq(prices.active, true),
            orderBy: (prices, { desc }) => [desc(prices.unitAmount)],
          },
        },
      })

      // products with prices where type is one_time
      const oneTimeProducts = productResults.filter(product =>
        product.prices.some(price => price.type === "one_time")
      )

      // order the oneTimeProducts by price asc (show the cheapest first)
      oneTimeProducts.sort((a, b) => {
        const maxPriceA = Math.max(...a.prices.map(price => price.unitAmount))
        const maxPriceB = Math.max(...b.prices.map(price => price.unitAmount))

        return maxPriceA - maxPriceB
      })

      // products with prices where type is recurring
      const recurringProducts = productResults.filter(product =>
        product.prices.some(price => price.type === "recurring")
      )

      // order the recurringProducts by price asc (show the cheapest first)
      recurringProducts.sort((a, b) => {
        const maxPriceA = Math.max(...a.prices.map(price => price.unitAmount))
        const maxPriceB = Math.max(...b.prices.map(price => price.unitAmount))

        return maxPriceA - maxPriceB
      })

      return { oneTimeProducts, recurringProducts }
    } catch (error) {
      logger.error("[product][getAll]", { error })
      return null
    }
  },
  /**
   * Upsert
   *
   * This function is used to upsert a product by its ID.
   *
   * @param {string} productId - The ID of the product to upsert.
   * @returns {Promise<void>} - This function does not return anything.
   **/
  async upsert({ productId }: { productId: string }) {
    try {
      const data = await stripe.products.retrieve(productId)
      const productData: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        marketingFeatures: data.marketing_features.map(
          feature => feature.name
        ) as string[],
        metadata: data.metadata,
        image: data.images?.[0], // we just support one image for now
        active: data.active,
      }

      await db
        .insert(products)
        .values(productData)
        .onConflictDoUpdate({ target: products.id, set: productData })
    } catch (error) {
      logger.error("[product][upsert]", { error })
    }
  },
  async delete({ productId }: { productId: string }) {
    try {
      await db.delete(products).where(eq(products.id, productId))
    } catch (error) {
      logger.error("[product][delete]", { error })
    }
  },
}
