/**
 * Authentication Server Actions
 *
 * - signInAction: Handles user sign-in process
 *   - Validates input data
 *   - Initiates sign-in with specified provider
 *   - Captures sign-in events for analytics
 * - signOutAction: Manages user sign-out process
 * @link https://authjs.dev/getting-started/migrating-to-v5
 **/

"use server"

import { unstable_after as after } from "next/server"
import { z } from "zod"
import { providers, signIn, signOut } from "@/auth"
import captureEvent from "@/lib/capture-event"
import { logger } from "@/lib/logger"

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

  after(async () => {
    await captureEvent({
      event: `sign_in_via_${provider}`,
      properties: { email, status: "success" },
    })
  })

  return {
    success: true,
  }
}

export async function signOutAction() {
  await signOut({ redirect: false })
  return {
    success: true,
  }
}
