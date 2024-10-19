/**
 * Newsletter Subscription Server Action
 *
 * Handles the process of subscribing users to the newsletter:
 * - subscribeToNewsletter: Manages newsletter sign-ups
 *   - Validates the provided email address
 *   - Interacts with Resend API to add the contact
 *   - Captures the sign-up event for analytics
 **/

"use server"

import { unstable_after as after } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { captureEvent } from "@/lib/capture-event"
import { resendAudienceId, resendEnabled } from "@/lib/constants"
import { logger } from "@/lib/logger"
import { getDistinctId } from "@/lib/post-hog"

const SubscribeToNewsletterSchema = z.object({
  email: z.string().email(),
})

export async function subscribeToNewsletter(email: string) {
  if (!resendEnabled || !resendAudienceId) {
    logger.warn("Resend is not enabled")
    return
  }

  const resultData = SubscribeToNewsletterSchema.safeParse({
    email,
  })

  if (!resultData.success) {
    logger.error("Invalid email", resultData.error)
    throw new Error("Invalid email")
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const createContactResponse = await resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId: resendAudienceId,
  })

  if (createContactResponse.error) {
    logger.error("Error creating contact", createContactResponse.error)
    throw new Error(createContactResponse.error.message)
  }

  // Get distinctId relies on cookies which are not supported in after
  const distinctId = await getDistinctId()
  after(async () => {
    await captureEvent({
      distinctId,
      event: "newsletter_signup",
      properties: { email, audienceId: resendAudienceId, status: "success" },
    })
  })

  return {
    success: true,
  }
}
