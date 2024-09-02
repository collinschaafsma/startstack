"use client"

import { useEffect } from "react"
import { captureException } from "@sentry/nextjs"
import { sentryEnabled } from "@/lib/constants"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry
    if (sentryEnabled) captureException(error)
  }, [error])

  return (
    <section className="w-full border-y pb-8 pt-12 md:pt-24 lg:pt-32">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
          Something went wrong
        </h1>
        <p className="mt-4 max-w-[300px] text-gray-500 dark:text-gray-400 md:text-xl lg:max-w-[700px]">
          We experienced an error while processing your request. Our team has
          been notified and will investigate the issue.
        </p>
        <Button onClick={() => reset()}>Reset</Button>
      </div>
    </section>
  )
}
