"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { usePostHog } from "posthog-js/react"
import { postHogEnabled } from "@/lib/constants"

/**
 * PostHogPageView Component
 *
 * This component is used to capture page views and identify users in PostHog.
 * It captures the current pathname, search parameters, and session data to track page views and identify users.
 *
 * @returns {null} - This component does not render anything.
 */
export default function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const session = useSession()

  useEffect(() => {
    if (pathname && posthog && postHogEnabled) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthog])

  // identify the user if they are logged in and have not been identified yet
  useEffect(() => {
    if (
      posthog &&
      !posthog._isIdentified() &&
      session.status === "authenticated" &&
      session.data?.user &&
      postHogEnabled
    ) {
      posthog.identify(session.data.user.id, { email: session.data.user.email })
    }
  }, [posthog, session.status, session.data?.user])

  return null
}
