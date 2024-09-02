"use client"

import { Component, FunctionComponent, ReactElement } from "react"
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import { logger } from "@/lib/logger"

const logError = (error: Error) => {
  logger.error("[ErrorBoundary]", { error })
}

/**
 * ErrorBoundary Component
 *
 * This component is used to wrap anything with the ErrorBoundary.
 * It provides a fallback UI when an error occurs and logs the error.
 *
 * @param {React.ReactNode} children - The children to be wrapped by the ErrorBoundary.
 * @param {ReactElement<unknown, string | FunctionComponent | typeof Component> | null} fallback - The fallback UI to display when an error occurs.
 * @returns {React.ReactNode} - The children wrapped by the ErrorBoundary.
 * @link https://github.com/bvaughn/react-error-boundary
 */
export function ErrorBoundary({
  children,
  fallback,
}: Readonly<{
  children: React.ReactNode
  fallback: ReactElement<
    unknown,
    string | FunctionComponent | typeof Component
  > | null
}>) {
  return (
    <ReactErrorBoundary fallback={fallback} onError={logError}>
      {children}
    </ReactErrorBoundary>
  )
}
