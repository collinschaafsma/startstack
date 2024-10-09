import { Suspense } from "react"
import Link from "next/link"
import { ErrorBoundary } from "react-error-boundary"
import { analytic } from "@/services/analytic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageViewChart } from "./page-view-chart"

function PageViewChartSkeleton() {
  return <Skeleton className="ml-4 h-[200px] w-[96%]" />
}

function PageViewChartErrorFallback() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-red-500">Error loading Page Views Chart</p>
    </div>
  )
}

function PosthogConfiguredBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  if (
    !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_POSTHOG_PERSONAL_KEY
  ) {
    return (
      <div className="flex items-center justify-center">
        <p className="p-4 text-red-500">
          Posthog not configured. Please set the NEXT_PUBLIC_POSTHOG_PROJECT_ID
          and NEXT_PUBLIC_POSTHOG_PERSONAL_KEY environment variables. See{" "}
          <Link
            href="https://www.startstack.io/docs/guides/analytics"
            className="text-blue-500 underline"
          >
            Analytics Guide
          </Link>{" "}
          for more information.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export function PageViewChartCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Page Views</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ErrorBoundary fallback={<PageViewChartErrorFallback />}>
          <PosthogConfiguredBoundary>
            <Suspense fallback={<PageViewChartSkeleton />}>
              <PageViewChart
                data={analytic.pageViews({
                  // 14 days ago
                  from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                  to: new Date(),
                })}
              />
            </Suspense>
          </PosthogConfiguredBoundary>
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
