/**
 * Authentication Server Actions
 *
 * @link https://authjs.dev/getting-started/migrating-to-v5
 **/

"use server"

import { unstable_after as after } from "next/server"
import { z } from "zod"
import { providers, signIn, signOut } from "@/auth"
import { captureEvent } from "@/lib/capture-event"
import { logger } from "@/lib/logger"
import { getDistinctId } from "@/lib/post-hog"

const emailSchema = z.string().email()
const EmailSignIn = z
  .object({
    email: z.string().optional(),
    redirectTo: z.string().optional(),
    provider: z.enum(
      providers.map(provider => provider.name.toLowerCase()) as [
        string,
        ...string[],
      ]
    ),
  })
  .refine(
    data => {
      // if the provider is resend, we need an email to send the link to
      if (data.provider === "resend") {
        const email = emailSchema.safeParse(data.email)
        if (!email.success) return false
      }
      return true
    },
    {
      message: "Email is required",
      path: ["email"],
    }
  )

/**
 * Sign In Server Action
 *
 * - signInAction: Handles user sign-in process
 *   - Validates input data
 *   - Initiates sign-in with specified provider
 *   - Captures sign-in events for analytics
 */
export async function signInAction({
  email,
  redirectTo,
  provider,
}: {
  email: string
  redirectTo: string
  provider: string
}) {
  const resultData = EmailSignIn.safeParse({
    email,
    redirectTo,
    provider,
  })

  if (!resultData.success) {
    logger.error("Invalid sign-in submission", resultData.error)
    throw new Error("Invalid sign-in submission")
  }

  await signIn(provider, {
    email,
    ...(provider === "resend" && { redirect: false }),
    redirectTo,
  })

  // Get distinctId relies on cookies which are not supported in after
  const distinctId = await getDistinctId()
  after(async () => {
    await captureEvent({
      distinctId,
      event: `sign_in_via_${provider}`,
      properties: { email, status: "success" },
    })
  })

  return {
    success: true,
  }
}

/**
 * Sign Up Server Action
 *
 * - signUpAction: Handles user sign-up process
 *   - Validates input data
 *   - Initiates sign-in with specified provider
 *   - Captures sign-up events for analytics
 * - add custom onboarding data / logic here if needed
 */
export async function signUpAction({
  email,
  redirectTo,
  provider,
}: {
  email: string
  redirectTo: string
  provider: string
}) {
  const resultData = EmailSignIn.safeParse({
    email,
    redirectTo,
    provider,
  })

  if (!resultData.success) {
    logger.error("Invalid sign-up submission", resultData.error)
    throw new Error("Invalid sign-up submission")
  }

  await signIn(provider, {
    email,
    ...(provider === "resend" && { redirect: false }),
    redirectTo,
  })

  // Get distinctId relies on cookies which are not supported in after
  const distinctId = await getDistinctId()
  after(async () => {
    await captureEvent({
      distinctId,
      event: `sign_up_via_${provider}`,
      properties: { email, status: "success" },
    })
  })

  return {
    success: true,
  }
}

/**
 * Sign Out Server Action
 *
 * - signOutAction: Manages user sign-out process
 *   - Initiates sign-out process
 *   - Returns success status
 */
export async function signOutAction() {
  await signOut({ redirect: false })
  return {
    success: true,
  }
}
