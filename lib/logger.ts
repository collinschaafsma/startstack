import { captureException } from "@sentry/nextjs"
import { sentryEnabled } from "./constants"

/**
 * Logger Utility
 *
 * Provides a centralized logging interface for the application:
 * - Supports info, error, warn, and debug log levels
 * - Integrates with Sentry for error tracking when enabled
 * - Uses console methods for local logging
 * - Allows additional context to be passed with log messages
 *
 * @link https://docs.sentry.io/platforms/javascript/guides/nextjs/usage/
 */
export const logger = {
  info: (
    message: string,
    args?: {
      [key: string]: any
    }
  ) => {
    console.info(message, args)
  },
  error: (
    message: string,
    args?: {
      [key: string]: any
    }
  ) => {
    console.error(message, args)
    if (sentryEnabled) captureException(args?.error || new Error(message))
  },
  warn: (
    message: string,
    args?: {
      [key: string]: any
    }
  ) => {
    console.warn(message, args)
  },
  debug: (
    message: string,
    args?: {
      [key: string]: any
    }
  ) => {
    console.debug(message, args)
  },
}
