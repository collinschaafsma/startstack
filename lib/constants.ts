/**
 * Constants
 *
 * This file contains constants that are used throughout the app.
 */

/**
 * Base URL
 *
 * This is the base URL of the app. Looks for NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL env variable.
 * If not set, defaults to "http://localhost:3000".
 */
export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

/**
 * Environment
 *
 * This is the environment of the app. Looks for NEXT_PUBLIC_VERCEL_ENV env variable.
 * If not set, defaults to "development".
 */
export const environment = process.env.NEXT_PUBLIC_VERCEL_ENV || "development"

/**
 * App Details
 *
 * This is the name of the app. Looks for NEXT_PUBLIC_APP_NAME env variable.
 * If not set, defaults to "Acme Corp".
 */
export const appName = process.env.NEXT_PUBLIC_APP_NAME || "Acme Corp"

/**
 * App Description
 *
 * This is the description of the app. Looks for NEXT_PUBLIC_APP_DESCRIPTION env variable.
 * If not set, defaults to "Acme Corp is a company that makes widgets."
 */
export const appDescription =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Acme Corp is a company that makes widgets."

/**
 * Twitter / X Details
 *
 * This is the Twitter / X creator of the app. Looks for NEXT_PUBLIC_TWITTER_CREATOR env variable.
 * If not set, defaults to "@acme".
 */
export const twitterCreator = process.env.NEXT_PUBLIC_TWITTER_CREATOR

/**
 * Twitter / X Site
 *
 * This is the Twitter / X site of the app.
 */
export const twitterSite = process.env.NEXT_PUBLIC_TWITTER_CREATOR
  ? `https://x.com/${process.env.NEXT_PUBLIC_TWITTER_CREATOR.replace("@", "")}`
  : undefined

/**
 * PostHog Enabled
 *
 * This allows PostHog to be enabled/disabled by setting the NEXT_PUBLIC_POSTHOG_KEY env variable.
 * @link https://posthog.com/
 */
export const postHogEnabled = process.env.NEXT_PUBLIC_POSTHOG_KEY ? true : false

/**
 * Sentry Enabled
 *
 * This allows Sentry to be enabled/disabled by setting the NEXT_PUBLIC_SENTRY_DSN env variable.
 * You must also set the SENTRY_AUTH_TOKEN env variable to a valid Sentry auth token.
 * And set the SENTRY_ORG and SENTRY_PROJECT env variables to the name of your Sentry organization and project.
 * @link https://sentry.io/
 */
export const sentryEnabled = process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false

/**
 * Resend Enabled
 *
 * This allows Resend to be enabled/disabled by setting the RESEND_API_KEY env variable.
 * @link https://resend.com/
 */
export const resendEnabled = process.env.RESEND_API_KEY ? true : false

/**
 * Resend Audience ID
 *
 * This is the audience ID of the Resend audience used for the newsletter. Looks for RESEND_NEWSLETTER_AUDIENCE_ID env variable.
 */
export const resendAudienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID

/**
 * Google OAuth Enabled
 *
 * This allows the Google OAuth provider to be enabled/disabled by setting the AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET env variables.
 * @link https://authjs.dev/reference/providers/google
 */
export const googleOauthEnabled =
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? true : false

/**
 * Allow Promotion Codes in Checkout
 *
 * This allows promotion codes to be enabled by setting the NEXT_PUBLIC_ALLOW_PROMOTION_CODES env variable to true.
 */
export const allowPromotionCodes =
  process.env.NEXT_PUBLIC_ALLOW_PROMOTION_CODES === "true"

/**
 * Put the app into Coming Soon mode
 *
 * This allows the coming soon page to be enabled by setting the NEXT_PUBLIC_ENABLE_COMING_SOON env variable to true.
 */
export const enableComingSoon =
  process.env.NEXT_PUBLIC_ENABLE_COMING_SOON === "true"

/**
 * Supported Stripe Webhook Events
 * events are processed in the event service. services/event.ts
 *
 */
export const supportedStripeEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.deleted",
  "customer.subscription.updated",
  "invoice.finalized",
  "invoice.paid",
  "payment_method.attached",
  "product.created",
  "product.deleted",
  "product.updated",
  "price.created",
  "price.deleted",
  "price.updated",
])

/**
 * Invoices Per Page Limit
 *
 * This is the number of invoices to show on the dashboard per page.
 */
export const invoicesLimit = 3
