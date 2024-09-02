"use client"

import { useEffect } from "react"
import NextError from "next/error"
import { captureException } from "@sentry/nextjs"
import { sentryEnabled } from "@/lib/constants"

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    if (sentryEnabled) captureException(error)
  }, [error])

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
