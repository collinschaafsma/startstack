"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { baseUrl, postHogEnabled } from "@/lib/constants"

if (typeof window !== "undefined" && postHogEnabled) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: `${baseUrl}/ingest`, // Client side, we use a proxy, see: https://posthog.com/docs/advanced/proxy/nextjs
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually in post-hog-page-view.tsx
  })
}

/**
 * PostHogProvider Component
 *
 * This component is used to wrap the application with the PostHogProvider.
 * It initializes the PostHog client and provides it to the application.
 *
 * @param {React.ReactNode} children - The children to be wrapped by the PostHogProvider.
 */
export function PostHogProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PHProvider client={posthog}>{children}</PHProvider>
}
