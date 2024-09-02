/**
 * Billing Portal Server Actions
 *
 * - updatePaymentMethodViaBillingPortal: Creates a session for updating payment methods
 * - cancelSubscriptionViaBillingPortal: Creates a session for canceling subscriptions
 * - updateSubscriptionViaBillingPortal: Creates a session for updating subscriptions
 *
 * These actions securely handle Stripe Billing Portal interactions, ensuring
 * proper user authentication and error handling. They generate and return
 * URLs for redirecting users to specific Stripe Billing Portal flows.
 **/

"use server"

import { redirect } from "next/navigation"
import { billingPortal } from "@/services/billingPortal"
import { currentUser } from "@/services/currentUser"
import { baseUrl } from "@/lib/constants"
import { logger } from "@/lib/logger"

export async function updatePaymentMethodViaBillingPortal() {
  let url: string
  try {
    const user = await currentUser.customerId()
    if (!user?.customerId) {
      throw new Error(
        "An error occurred while creating a billing portal session"
      )
    }

    url = await billingPortal.sessions.createURL({
      customer: user.customerId,
      return_url: `${baseUrl}/dashboard`,
      flow_data: {
        type: "payment_method_update",
        after_completion: {
          type: "redirect",
          redirect: {
            return_url: `${baseUrl}/dashboard`,
          },
        },
      },
    })
  } catch (error) {
    logger.error("[updatePaymentMethodViaBillingPortal]", { error })
    throw new Error("An error occurred while creating a billing portal session")
  }

  if (url) redirect(url)
}

export async function cancelSubscriptionViaBillingPortal() {
  let url: string
  try {
    const userWithCustomerId = await currentUser.customerId()
    const userWithSubscriptionId = await currentUser.subscriptionId()
    if (
      !userWithCustomerId?.customerId ||
      !userWithSubscriptionId?.subscriptionId
    ) {
      throw new Error(
        "An error occurred while creating a billing portal session"
      )
    }

    url = await billingPortal.sessions.createURL({
      customer: userWithCustomerId.customerId,
      return_url: `${baseUrl}/dashboard`,
      flow_data: {
        type: "subscription_cancel",
        subscription_cancel: {
          subscription: userWithSubscriptionId.subscriptionId,
        },
        after_completion: {
          type: "redirect",
          redirect: {
            return_url: `${baseUrl}/dashboard`,
          },
        },
      },
    })
  } catch (error) {
    logger.error("[cancelSubscriptionViaBillingPortal]", { error })
    throw new Error("An error occurred while creating a billing portal session")
  }

  if (url) redirect(url)
}

export async function updateSubscriptionViaBillingPortal() {
  let url: string
  try {
    const userWithCustomerId = await currentUser.customerId()
    const userWithSubscriptionId = await currentUser.subscriptionId()
    if (
      !userWithCustomerId?.customerId ||
      !userWithSubscriptionId?.subscriptionId
    ) {
      throw new Error(
        "An error occurred while creating a billing portal session"
      )
    }

    url = await billingPortal.sessions.createURL({
      customer: userWithCustomerId.customerId,
      return_url: `${baseUrl}/dashboard`,
      flow_data: {
        type: "subscription_update",
        subscription_update: {
          subscription: userWithSubscriptionId.subscriptionId,
        },
        after_completion: {
          type: "redirect",
          redirect: {
            return_url: `${baseUrl}/dashboard`,
          },
        },
      },
    })
  } catch (error) {
    logger.error("[updateSubscriptionViaBillingPortal]", { error })
    throw new Error("An error occurred while creating a billing portal session")
  }

  if (url) redirect(url)
}
