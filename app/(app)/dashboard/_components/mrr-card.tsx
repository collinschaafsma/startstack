import { Suspense } from "react"
import { DollarSign } from "lucide-react"
import { analytic } from "@/services/analytic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

interface MRRData {
  current: number
  previous: number
  percentageChange: number
}
/**
 * Compose MRR data
 *
 * This function fetches the current and previous month's MRR data.
 * It calculates the current MRR by calling the analytic.mrr method with the current month's start timestamp.
 * It calculates the previous MRR by calling the analytic.mrr method with the previous month's start timestamp.
 * It then calculates the percentage change between the current and previous MRR.
 *
 * @returns {Promise<MRRData>} - The MRR data for the current and previous month.
 */
async function composeMRRData(): Promise<MRRData> {
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [currentMRR, previousMRR] = await Promise.all([
    analytic.mrr(currentMonthStart),
    analytic.mrr(previousMonthStart),
  ])

  const percentageChange = ((currentMRR - previousMRR) / previousMRR) * 100

  return {
    current: currentMRR,
    previous: previousMRR,
    percentageChange: percentageChange,
  }
}

export async function LoadMRRCard() {
  const mrrData = await composeMRRData()
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">MRR</CardTitle>
        <DollarSign className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${mrrData.current}</div>
        <p className="text-xs text-muted-foreground">
          {mrrData.percentageChange >= 0 ? "+" : ""}
          {mrrData.percentageChange.toFixed(1)}% from last month
        </p>
      </CardContent>
    </Card>
  )
}

function MRRCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">MRR</CardTitle>
        <DollarSign className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-20" />
        <Skeleton className="mt-2 h-3 w-40" />
      </CardContent>
    </Card>
  )
}

function MRRCardErrorFallback() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">MRR</CardTitle>
        <DollarSign className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-red-500">Error loading MRR</div>
      </CardContent>
    </Card>
  )
}

export function MRRCard() {
  return (
    <ErrorBoundary fallback={<MRRCardErrorFallback />}>
      <Suspense fallback={<MRRCardSkeleton />}>
        <LoadMRRCard />
      </Suspense>
    </ErrorBoundary>
  )
}