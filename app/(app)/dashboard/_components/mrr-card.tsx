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

  // from jan 1 to now
  const currentMonthRange = {
    from: new Date(now.getFullYear(), 0, 1),
    to: now,
  }
  // from jan 1 to end of last month
  const previousMonthRange = {
    from: new Date(now.getFullYear(), 0, 1),
    to: new Date(now.getFullYear(), now.getMonth() - 1, 31),
  }

  const [current, previous] = await Promise.all([
    analytic.mrr(currentMonthRange),
    analytic.mrr(previousMonthRange),
  ])

  const percentageChange = ((current - previous) / previous) * 100

  return {
    current,
    previous,
    percentageChange,
  }
}

export async function LoadMRRCard() {
  const mrrData = await composeMRRData()

  return (
    <>
      <div className="text-2xl font-bold">${mrrData.current}</div>
      <p className="text-xs text-muted-foreground">
        {mrrData.percentageChange >= 0 ? "+" : ""}
        {mrrData.percentageChange.toFixed(1)}% from last month
      </p>
    </>
  )
}

function MRRCardSkeleton() {
  return (
    <>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="mt-2 h-3 w-40" />
    </>
  )
}

function MRRCardErrorFallback() {
  return <div className="text-red-500">Error loading MRR</div>
}

export function MRRCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">MRR</CardTitle>
        <DollarSign className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ErrorBoundary fallback={<MRRCardErrorFallback />}>
          <Suspense fallback={<MRRCardSkeleton />}>
            <LoadMRRCard />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
