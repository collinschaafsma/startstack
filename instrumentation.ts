import { init } from "@sentry/nextjs"
import { sentryEnabled } from "./lib/constants"

export async function register() {
  if (sentryEnabled) {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for tracing.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // ...

        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
      })
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for tracing.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // ...

        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
      })
    }
  }
}
