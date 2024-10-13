import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { analytic } from "@/services/analytic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MRRChart } from "./mrr-chart"

function MRRChartErrorFallback() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-red-500">Error loading MRR Growth Chart</p>
    </div>
  )
}

export function MRRChartCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>MRR Growth</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ErrorBoundary fallback={<MRRChartErrorFallback />}>
          <Suspense fallback={<Skeleton className="ml-4 h-[200px] w-[96%]" />}>
            <MRRChart
              dataPromise={analytic.mrrGrowth({
                from: new Date(2024, 0, 1),
                to: new Date(),
              })}
            />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
