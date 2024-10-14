import {
  InferInsertModel,
  InferSelectModel,
  relations,
  SQL,
  sql,
} from "drizzle-orm"
import {
  AnyPgColumn,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

/**
 * Lower
 *
 * This function is used to convert a column to lowercase.
 *
 * @param {AnyPgColumn} email - The column to convert to lowercase.
 * @returns {SQL} - The SQL expression to convert the column to lowercase.
 */
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`
}

/**
 * CountAsNumber
 *
 * This function is used to count the number of rows in a table.
 *
 * @param {AnyPgColumn} column - The column to count.
 * @returns {SQL} - The SQL expression to count the number of rows in a table.
 */
export function countAsNumber(column?: AnyPgColumn) {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`
  } else {
    return sql<number>`cast(count(*) as integer)`
  }
}

export const roleEnum = pgEnum("role", ["admin", "user"])

const pricingTypes = ["recurring", "one_time"] as const
export type PricingType = (typeof pricingTypes)[number]
export const pricingTypeEnum = pgEnum("pricingType", pricingTypes)

const pricingPlanIntervals = ["day", "week", "month", "year"] as const
export type PricingPlanInterval = (typeof pricingPlanIntervals)[number]
export const pricingPlanIntervalEnum = pgEnum(
  "pricingPlanInterval",
  pricingPlanIntervals
)

const subscriptionStatuses = [
  "trialing",
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "unpaid",
  "paused",
] as const
export type SubscriptionStatus = (typeof subscriptionStatuses)[number]
export const subscriptionStatusEnum = pgEnum(
  "subscriptionStatus",
  subscriptionStatuses
)

const checkoutSessionModes = ["payment", "subscription", "setup"] as const
export type CheckoutSessionMode = (typeof checkoutSessionModes)[number]
export const checkoutSessionModeEnum = pgEnum(
  "checkoutSessionMode",
  checkoutSessionModes
)

const checkoutSessionStatuses = ["open", "complete", "expired"] as const
export type CheckoutSessionStatus = (typeof checkoutSessionStatuses)[number]
export const checkoutSessionStatusEnum = pgEnum(
  "checkoutSessionStatus",
  checkoutSessionStatuses
)

const checkoutSessionPaymentStatuses = [
  "unpaid",
  "paid",
  "no_payment_required",
] as const
export type CheckoutSessionPaymentStatus =
  (typeof checkoutSessionPaymentStatuses)[number]
export const checkoutSessionPaymentStatusEnum = pgEnum(
  "checkoutSessionPaymentStatus",
  checkoutSessionPaymentStatuses
)

const paymentIntentStatuses = [
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
  "processing",
  "requires_capture",
  "canceled",
  "succeeded",
] as const
export type PaymentIntentStatus = (typeof paymentIntentStatuses)[number]
export const paymentIntentStatusEnum = pgEnum(
  "paymentIntentStatus",
  paymentIntentStatuses
)

const invoiceStatuses = [
  "draft",
  "open",
  "paid",
  "uncollectible",
  "void",
] as const
export type InvoiceStatus = (typeof invoiceStatuses)[number]
export const invoiceStatusEnum = pgEnum("invoiceStatus", invoiceStatuses)

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: roleEnum("role").notNull().default("user"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  authenticator => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

// see: https://docs.stripe.com/api/products/object
export const products = pgTable("product", {
  // stripe id (prod_123)
  id: text("id").primaryKey().notNull(),
  active: boolean("active").notNull().default(true),
  description: text("description"),
  image: text("image"),
  marketingFeatures: text("marketingFeatures")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  name: text("name").notNull(),
})

export const productRelations = relations(products, ({ many }) => ({
  prices: many(prices),
}))

// see: https://docs.stripe.com/api/prices/object
export const prices = pgTable("price", {
  // stripe id (price_123)
  id: text("id").primaryKey().notNull(),
  active: boolean("active").notNull().default(true),
  currency: text("currency").notNull(),
  description: text("description"),
  interval: pricingPlanIntervalEnum("interval"),
  intervalCount: integer("intervalCount"),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  productId: text("productId")
    .notNull()
    .references(() => products.id),
  type: pricingTypeEnum("type").notNull(),
  unitAmount: integer("unitAmount").notNull(),
})

export const pricesRelations = relations(prices, ({ one }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
}))

// see: https://docs.stripe.com/api/customers/object
// this table is used to store the stripeCustomerId for each user
// this could be expanded to store more customer information, such as shipping address, etc. if you sell a physical product
export const customers = pgTable(
  "customer",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    stripeCustomerId: text("stripeCustomerId").notNull(), // stripe id (cus_123)
    created: timestamp("created", { mode: "date" }).notNull().defaultNow(),
  },
  customer => ({
    compositePK: primaryKey({
      columns: [customer.userId, customer.stripeCustomerId],
    }),
  })
)

export const customersRelations = relations(customers, ({ one }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}))

// see: https://docs.stripe.com/api/subscriptions/object
export const subscriptions = pgTable("subscription", {
  // stripe id (sub_123)
  id: text("id").primaryKey().notNull(),
  cancelAt: timestamp("cancelAt", { mode: "date" }),
  canceledAt: timestamp("canceledAt", { mode: "date" }),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull(),
  created: timestamp("created", { mode: "date" }).notNull().defaultNow(),
  currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" })
    .notNull()
    .defaultNow(),
  currentPeriodStart: timestamp("currentPeriodStart", { mode: "date" })
    .notNull()
    .defaultNow(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  description: text("description"),
  endedAt: timestamp("endedAt", { mode: "date" }),
  priceId: text("priceId")
    .notNull()
    .references(() => prices.id),
  quantity: integer("quantity").notNull().default(1),
  status: subscriptionStatusEnum("status").notNull(),
  trialEnd: timestamp("trialEnd", { mode: "date" }),
  trialStart: timestamp("trialStart", { mode: "date" }),
})

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  price: one(prices, {
    fields: [subscriptions.priceId],
    references: [prices.id],
  }),
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))

// see: https://docs.stripe.com/api/checkout/sessions/object
// if the mode is "subscription" then the subscriptionId will be set and a subscription will be created
// if the mode is "payment" then the paymentIntentId will be set and a paymentIntent will be created
export const checkoutSessions = pgTable("checkoutSession", {
  // stripe id (cs_123)
  id: text("id").primaryKey().notNull(),
  amountTotal: integer("amountTotal"),
  amountSubtotal: integer("amountSubtotal"),
  created: timestamp("created", { mode: "date" }).notNull().defaultNow(),
  mode: checkoutSessionModeEnum("mode").notNull(),
  paymentIntentId: text("paymentIntentId").references(() => paymentIntents.id),
  paymentStatus: checkoutSessionPaymentStatusEnum("paymentStatus").notNull(),
  status: checkoutSessionStatusEnum("status").notNull(),
  subscriptionId: text("subscriptionId").references(() => subscriptions.id),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  priceId: text("priceId")
    .notNull()
    .references(() => prices.id),
})

// see: https://docs.stripe.com/api/payment_intents/object
export const paymentIntents = pgTable("paymentIntent", {
  // stripe id (pi_123)
  id: text("id").primaryKey().notNull(),
  amount: integer("amount").notNull(),
  created: timestamp("created", { mode: "date" }).notNull().defaultNow(),
  description: text("description"),
  status: paymentIntentStatusEnum("status").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
})

// see: https://docs.stripe.com/api/payment_methods/object
export const paymentMethods = pgTable("paymentMethod", {
  // stripe id (pm_123)
  id: text("id").primaryKey().notNull(),
  brand: text("brand").notNull(),
  created: timestamp("created", { mode: "date" }).notNull().defaultNow(),
  expMonth: integer("expMonth").notNull(),
  expYear: integer("expYear").notNull(),
  last4: text("last4").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
})

// see: https://docs.stripe.com/api/invoices/object
export const invoices = pgTable("invoice", {
  // stripe id (in_123)
  id: text("id").primaryKey().notNull(),
  amountDue: integer("amountDue").notNull(),
  amountPaid: integer("amountPaid").notNull(),
  amountRemaining: integer("amountRemaining").notNull(),
  created: timestamp("created", { mode: "date" }).notNull().defaultNow(),
  hostedInvoiceUrl: text("hostedInvoiceUrl"),
  invoiceNumber: text("invoiceNumber"),
  invoicePdf: text("invoicePdf"),
  paymentIntentId: text("paymentIntentId").references(() => paymentIntents.id),
  status: invoiceStatusEnum("status").notNull(),
  subscriptionId: text("subscriptionId").references(() => subscriptions.id),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
})

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
}))

// Product types
export type Product = InferSelectModel<typeof products>
export type NewProduct = InferInsertModel<typeof products>
export type UpdateProduct = Omit<NewProduct, "id">

// Price types
export type Price = InferSelectModel<typeof prices>
export type NewPrice = InferInsertModel<typeof prices>
export type UpdatePrice = Omit<NewProduct, "id">

// PaymentMethod types
export type PaymentMethod = InferSelectModel<typeof paymentMethods>

// Subscription types
export type Subscription = InferSelectModel<typeof subscriptions>
export type SubscriptionPrice = InferSelectModel<typeof subscriptions> & {
  price: Price
}

// Invoice types
export type Invoice = InferSelectModel<typeof invoices>

// Metadata types
export type Metadata = {
  [key: string]: string
}
