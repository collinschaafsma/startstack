import { Suspense } from "react"
import { currentUser } from "@/services/currentUser"

async function LoadAuthBoundary({
  children,
  alternate,
}: Readonly<{
  children: React.ReactNode
  alternate?: React.ReactNode | string
}>) {
  const user = await currentUser()
  if (!user) {
    return alternate ? <>{alternate}</> : null
  }

  return <>{children}</>
}

/**
 * Auth Boundary
 *
 * This component is used to wrap a component that should only be rendered if the user is authenticated.
 * If the user is not authenticated, the alternate component or null is returned.
 *
 * @param {React.ReactNode} children - The component to be rendered if the user is authenticated.
 * @param {React.ReactNode | string} alternate - The component or string to be rendered if the user is not authenticated.
 * @param {React.ReactNode} fallback - The fallback component to be rendered while the user is being checked.
 */
export function AuthBoundary({
  children,
  fallback,
  alternate,
}: Readonly<{
  children: React.ReactNode
  fallback?: React.ReactNode | string
  alternate?: React.ReactNode | string
}>) {
  return (
    <Suspense fallback={fallback}>
      <LoadAuthBoundary alternate={alternate}>{children}</LoadAuthBoundary>
    </Suspense>
  )
}

async function LoadAdminBoundary({
  children,
  alternate,
}: Readonly<{
  children: React.ReactNode
  alternate?: React.ReactNode | string
}>) {
  const user = await currentUser()
  if (user?.role !== "admin") {
    return alternate ? <>{alternate}</> : null
  }

  return <>{children}</>
}

/**
 * Admin Boundary
 *
 * This component is used to wrap a component that should only be rendered if the user is an admin.
 * If the user is not an admin, the alternate component or null is returned.
 *
 * @param {React.ReactNode} children - The component to be rendered if the user is an admin.
 * @param {React.ReactNode | string} alternate - The component or string to be rendered if the user is not an admin.
 * @param {React.ReactNode} fallback - The fallback component to be rendered while the user is being checked.
 */
export function AdminBoundary({
  children,
  fallback,
}: Readonly<{
  children: React.ReactNode
  fallback?: React.ReactNode | string
}>) {
  return (
    <Suspense fallback={fallback}>
      <LoadAdminBoundary>{children}</LoadAdminBoundary>
    </Suspense>
  )
}

async function LoadSubscriptionCanceledBoundary({
  children,
  alternate,
}: Readonly<{
  children: React.ReactNode
  alternate?: React.ReactNode | string
}>) {
  const user = await currentUser.subscriptions({ limit: 1 })

  if (!user?.subscriptions || user.subscriptions.length === 0) {
    return null
  }

  const { cancelAtPeriodEnd } = user.subscriptions[0]

  if (cancelAtPeriodEnd) {
    return alternate ? <>{alternate}</> : null
  }

  return <>{children}</>
}

/**
 * Subscription Canceled Boundary
 *
 * This component is used to wrap a component that should only be rendered if the user has canceled their subscription.
 * If the user has not canceled their subscription, the alternate component or null is returned.
 *
 * @param {React.ReactNode} children - The component to be rendered if the user has canceled their subscription.
 * @param {React.ReactNode | string} alternate - The component or string to be rendered if the user has not canceled their subscription.
 * @param {React.ReactNode} fallback - The fallback component to be rendered while the user is being checked.
 */
export function SubscriptionCanceledBoundary({
  children,
  alternate,
  fallback,
}: Readonly<{
  children: React.ReactNode
  alternate?: React.ReactNode | string
  fallback?: React.ReactNode
}>) {
  return (
    <Suspense fallback={fallback}>
      <LoadSubscriptionCanceledBoundary alternate={alternate}>
        {children}
      </LoadSubscriptionCanceledBoundary>
    </Suspense>
  )
}
