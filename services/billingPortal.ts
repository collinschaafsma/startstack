import "server-only"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"

/**
 * Billing Portal Service
 *
 * Provides functionality to create Stripe Billing Portal sessions:
 * - Creates a URL for accessing the Stripe Billing Portal
 * - Allows customers to manage their subscriptions and billing details
 * @link https://docs.stripe.com/api/customer_portal/sessions/create
 **/
export const billingPortal = {
  /**
   * Create URL
   *
   * This function is used to create a URL for accessing the Stripe Billing Portal.
   *
   * @param {Stripe.BillingPortal.SessionCreateParams} params - The parameters for creating a billing portal session.
   * @returns {Promise<string>} - The URL for accessing the Stripe Billing Portal.
   * @link https://docs.stripe.com/api/customer_portal/sessions/create
   **/
  sessions: {
    async createURL(params: Stripe.BillingPortal.SessionCreateParams) {
      const session = await stripe.billingPortal.sessions.create(params)
      return session.url
    },
  },
}
