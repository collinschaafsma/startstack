import "server-only"
import type { EventMessage } from "posthog-node/lib/posthog-node/src/types"
import { postHogEnabled } from "./constants"
import { logger } from "./logger"
import { getDistinctId, postHogClient } from "./post-hog"

// Omit distinctId from EventMessage and add distinctId as an optional property
type Event = Omit<EventMessage, "distinctId"> & { distinctId?: string }

/**
 * Capture Event Function
 *
 * Sends analytics events to PostHog:
 * - Checks if PostHog is enabled before sending
 * - Automatically assigns a distinctId if not provided
 * - Uses server-side PostHog client for event capture
 * - Handles client shutdown after event capture
 *
 * @link https://posthog.com/docs/product-analytics/capture-events?tab=Node.js
 **/
export async function captureEvent(event: Event) {
  if (!postHogEnabled) {
    logger.info("PostHog is disabled, not capturing event", event)
    return
  }

  // If there is no distinctId, attempt to get one from the cookie.
  // If there is no cookie, getDistinctId will generate a new one using nanoid()
  if (!event.distinctId) event.distinctId = await getDistinctId()

  const postHog = postHogClient()
  if (!postHog) return

  postHog.capture(event as EventMessage)
  await postHog.shutdown()
}
