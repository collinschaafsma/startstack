import "server-only"
import { cache } from "react"
import { and, eq, inArray } from "drizzle-orm"
import { Session } from "next-auth"
import { db } from "@/drizzle/db"
import {
  checkoutSessions,
  countAsNumber,
  Invoice,
  invoices,
  PaymentMethod,
  prices,
  products,
  SubscriptionPrice,
} from "@/drizzle/schema"
import { auth } from "@/auth"
import { invoicesLimit } from "@/lib/constants"
import { logger } from "@/lib/logger"

type PaginationParams = {
  page?: number
  limit?: number
}

type InvoiceParams = { page: number; userId: string }
type PaymentMethodParams = PaginationParams & { userId: string }
type SubscriptionParams = PaginationParams & { userId: string }

interface CurrentUserService {
  customerId: (params: { userId: string }) => Promise<string | null>
  subscriptionId: (params: { userId: string }) => Promise<string | null>
  invoices: (params: InvoiceParams) => Promise<Invoice[]>
  invoicesTotal: (params: { userId: string }) => Promise<number>
  paymentMethods: (params: PaymentMethodParams) => Promise<PaymentMethod[]>
  subscriptions: (params: SubscriptionParams) => Promise<SubscriptionPrice[]>
  hasPurchasedProduct: (params: {
    userId: string
    productIds: string[]
  }) => Promise<boolean>
}

interface CurrentUser {
  /**
   * CurrentUser
   *
   * This function is used to get the current user.
   *
   * @returns {Promise<Session["user"] | null>} - The current user.
   */
  (): Promise<Session["user"] | null>
  /**
   * CustomerId
   *
   * This function is used to get the stripe customer id for a user.
   *
   * @returns {Promise<string | null>} - The customer id for the user.
   */
  customerId: () => Promise<
    (Session["user"] & { customerId: string | null }) | null
  >
  /**
   * SubscriptionId
   *
   * This function is used to get the stripe subscription id for a user.
   *
   * @returns {Promise<string | null>} - The subscription id for the user.
   */
  subscriptionId: () => Promise<
    (Session["user"] & { subscriptionId: string | null }) | null
  >
  /**
   * Invoices
   *
   * This function is used to get the invoices for a user.
   *
   * @param {number} page - The page number to get.
   * @returns {Promise<Session["user"] & {invoices: Awaited<ReturnType<typeof currentUserService.invoices> | null>}> - The invoices for the user.
   */
  invoices: (params: { page: number }) => Promise<
    Session["user"] & {
      invoices: Awaited<ReturnType<typeof currentUserService.invoices> | null>
    }
  >
  /**
   * InvoicesTotal
   *
   * This function is used to get the total number of invoices for a user.
   *
   * @returns {Promise<Session["user"] & {invoicesTotal: Awaited<ReturnType<typeof currentUserService.invoicesTotal> | null>}> - The total number of invoices for the user.
   */
  invoicesTotal: () => Promise<
    Session["user"] & {
      invoicesTotal: Awaited<ReturnType<
        typeof currentUserService.invoicesTotal
      > | null>
    }
  >
  /**
   * PaymentMethods
   *
   * This function is used to get the payment methods for a user.
   *
   * @param {number} page - The page number to get.
   * @param {number} limit - The number of payment methods to get.
   * @returns {Promise<Session["user"] & {paymentMethods: Awaited<ReturnType<typeof currentUserService.paymentMethods> | null>} - The payment methods for the user.
   */
  paymentMethods: (params: PaginationParams) => Promise<
    Session["user"] & {
      paymentMethods: Awaited<ReturnType<
        typeof currentUserService.paymentMethods
      > | null>
    }
  >
  /**
   * Subscriptions
   *
   * This function is used to get the subscriptions for a user.
   *
   * @param {number} page - The page number to get.
   * @param {number} limit - The number of subscriptions to get.
   * @returns {Promise<Session["user"] & {subscriptions: Awaited<ReturnType<typeof currentUserService.subscriptions> | null>} - The subscriptions for the user.
   */
  subscriptions: (params: PaginationParams) => Promise<
    Session["user"] & {
      subscriptions: Awaited<ReturnType<
        typeof currentUserService.subscriptions
      > | null>
    }
  >
  /**
   * HasPurchasedProduct
   *
   * This function is used to check if a user has purchased a product.
   *
   * @param {string[]} productIds - The ids of the products to check.
   * @returns {Promise<Session["user"] & {hasPurchasedProduct: Awaited<ReturnType<typeof currentUserService.hasPurchasedProduct> | null>}> - Whether the user has purchased the product.
   */
  hasPurchasedProduct: (params: { productIds: string[] }) => Promise<
    Session["user"] & {
      hasPurchasedProduct: Awaited<ReturnType<
        typeof currentUserService.hasPurchasedProduct
      > | null>
    }
  >
}

const currentUserService: CurrentUserService = {
  /**
   * CustomerId
   *
   * This function is used to get the stripe customer id for a user.
   *
   * @param {string} userId - The id of the user.
   * @returns {Promise<string | null>} - The customer id for the user.
   */
  customerId: cache(async ({ userId }: { userId: string }) => {
    const customer = await db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.userId, userId),
    })

    return customer?.stripeCustomerId ?? null
  }),
  /**
   * SubscriptionId
   *
   * This function is used to get the stripe subscription id for a user.
   *
   * @param {string} userId - The id of the user.
   * @returns {Promise<string | null>} - The subscription id for the user.
   */
  subscriptionId: cache(async ({ userId }: { userId: string }) => {
    const subscription = await db.query.subscriptions.findFirst({
      where: (subscriptions, { eq }) => eq(subscriptions.userId, userId),
    })

    return subscription?.id ?? null
  }),
  /**
   * Invoices
   *
   * This function is used to get the invoices for a user.
   *
   * @param {string} userId - The id of the user.
   * @param {number} page - The page number to get.
   * @returns {Promise<Invoice[]>} - The invoices for the user.
   */
  invoices: cache(async ({ page = 1, userId }: InvoiceParams) => {
    return await db.query.invoices.findMany({
      where: (invoices, { eq }) => eq(invoices.userId, userId),
      orderBy: (invoices, { desc }) => desc(invoices.created),
      limit: invoicesLimit,
      offset: (page - 1) * invoicesLimit,
    })
  }),
  /**
   * InvoicesTotal
   *
   * This function is used to get the total number of invoices for a user.
   *
   * @param {string} userId - The id of the user.
   * @returns {Promise<number>} - The total number of invoices for the user.
   */
  invoicesTotal: cache(async ({ userId }: { userId: string }) => {
    return (
      (
        await db
          .select({ count: countAsNumber() })
          .from(invoices)
          .where(eq(invoices.userId, userId))
      )[0].count ?? 0
    )
  }),
  /**
   * PaymentMethods
   *
   * This function is used to get the payment methods for a user.
   *
   * @param {string} userId - The id of the user.
   * @param {number} page - The page number to get.
   * @param {number} limit - The number of payment methods to get.
   * @returns {Promise<PaymentMethod[]>} - The payment methods for the user.
   */
  paymentMethods: cache(
    async ({ page = 1, limit = 10, userId }: PaymentMethodParams) => {
      return await db.query.paymentMethods.findMany({
        where: (paymentMethods, { eq }) => eq(paymentMethods.userId, userId),
        orderBy: (paymentMethods, { desc }) => desc(paymentMethods.created),
        limit: limit,
        offset: (page - 1) * limit,
      })
    }
  ),
  /**
   * Subscriptions
   *
   * This function is used to get the subscriptions for a user.
   *
   * @param {string} userId - The id of the user.
   * @param {number} page - The page number to get.
   * @param {number} limit - The number of subscriptions to get.
   * @returns {Promise<SubscriptionPrice[]>} - The subscriptions for the user.
   */
  subscriptions: cache(
    async ({ page = 1, limit = 10, userId }: SubscriptionParams) => {
      return await db.query.subscriptions.findMany({
        where: (subscriptions, { eq }) => eq(subscriptions.userId, userId),
        orderBy: (subscriptions, { desc }) => desc(subscriptions.created),
        limit: limit,
        offset: (page - 1) * limit,
        with: {
          price: true,
        },
      })
    }
  ),
  /**
   * HasPurchasedProduct
   *
   * This function is used to check if a user has purchased a product.
   *
   * @param {string} userId - The id of the user.
   * @param {string[]} productIds - The ids of the products to check.
   * @returns {Promise<boolean>} - Whether the user has purchased the product.
   */
  hasPurchasedProduct: cache(
    async ({
      userId,
      productIds,
    }: {
      userId: string
      productIds: string[]
    }) => {
      const result = await db
        .selectDistinctOn([checkoutSessions.id], { id: checkoutSessions.id })
        .from(checkoutSessions)
        .innerJoin(prices, eq(checkoutSessions.priceId, prices.id))
        .innerJoin(products, eq(prices.productId, products.id))
        .where(
          and(
            eq(checkoutSessions.userId, userId),
            eq(checkoutSessions.paymentStatus, "paid"),
            eq(checkoutSessions.status, "complete"),
            inArray(products.id, productIds)
          )
        )

      return result.length > 0
    }
  ),
}

/**
 * CreateCurrentUserServiceProxy
 *
 * This function is used to create a proxy for the current user service.
 *
 * @param {T} currentUser - The current user service.
 * @returns {CurrentUser} - The proxy for the current user service.
 */
const createCurrentUserServiceProxy = <T extends object>(
  currentUser: T
): CurrentUser => {
  const getUser = cache(async () => {
    const session = await auth()
    return session?.user
  })

  // Create a proxy to intercept calls to the currentUser service
  return new Proxy(getUser, {
    // add userId to the arguments of the service methods and add the user object to the response
    get(target, prop, receiver) {
      const property = currentUser[prop as keyof T]
      try {
        if (typeof property === "function") {
          return async (...args: any[]) => {
            const user = await getUser()
            if (!user) {
              return null
            }

            const augmentedArgs = [{ userId: user.id, ...args[0] }]
            const result = await (property as Function).apply(
              target,
              augmentedArgs
            )

            return { ...user, [String(prop)]: result }
          }
        }

        return Reflect.get(target, prop, receiver)
      } catch (error) {
        logger.error(`[currentUser][${property}]`, { error })
        throw error
      }
    },
    // apply the "getUser" function to the proxy as ()
    apply(target, thisArg) {
      try {
        return target.apply(thisArg)
      } catch (error) {
        logger.error("[currentUser()]", { error })
        throw error
      }
    },
  }) as CurrentUser
}

/**
 * CurrentUser
 *
 * This is the current user service. It returns the current user and their associated data.
 * The currentUser is determined by the auth session.
 *
 * @returns {CurrentUser} - The current user service.
 */
export const currentUser = createCurrentUserServiceProxy(currentUserService)
