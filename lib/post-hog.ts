import "server-only"
import { cookies } from "next/headers"
import { nanoid } from "nanoid"
import { PostHog } from "posthog-node"
import { postHogEnabled } from "./constants"

/**
 * PostHog Client (node / server side)
 *
 * @link https://posthog.com/docs/libraries/node
 **/
export function postHogClient() {
  if (!postHogEnabled) return null

  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
}

export async function getDistinctId() {
  const cookie = (await cookies()).get(
    `ph_${process.env.NEXT_PUBLIC_POSTHOG_KEY!}_posthog`
  )
  if (!cookie) return nanoid()

  const data = JSON.parse(cookie.value)
  return data.distinct_id || nanoid()
}
