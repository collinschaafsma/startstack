import { Suspense } from "react"
import { Landmark } from "lucide-react"
import { analytic } from "@/services/analytic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

interface GrossData {
  current: number
  previous: number
  percentageChange: number
}

/**
 * Compose gross data
 *
 * This function fetches the current and previous month's gross data.
 * It calculates the current gross by calling the analytic.gross method with the current month's start timestamp.
 * It calculates the previous gross by calling the analytic.gross method with the previous month's start timestamp.
 * It then calculates the percentage change between the current and previous gross.
 *
 * @returns {Promise<GrossData>} - The gross data for the current and previous month.
 */
async function composeGrossData(): Promise<GrossData> {
  const now = new Date()

  // from 2024 to now
  const currentMonthRange = {
    from: new Date(2024, 0, 1),
    to: now,
  }
  // from 2024 to end of last month
  const previousMonthRange = {
    from: new Date(2024, 0, 1),
    to: new Date(now.getFullYear(), now.getMonth() - 1, 31),
  }

  const [current, previous] = await Promise.all([
    analytic.gross(currentMonthRange),
    analytic.gross(previousMonthRange),
  ])

  const percentageChange = ((current - previous) / previous) * 100

  return {
    current,
    previous,
    percentageChange,
  }
}

async function LoadGrossCard() {
  const grossData = await composeGrossData()

  return (
    <>
      <div className="text-2xl font-bold">${grossData.current}</div>
      <p className="text-xs text-muted-foreground">
        {grossData.percentageChange >= 0 ? "+" : ""}
        {grossData.percentageChange.toFixed(1)}% from last month
      </p>
    </>
  )
}

function GrossCardErrorFallback() {
  return <div className="text-red-500">Error loading gross data</div>
}

function GrossCardSkeleton() {
  return (
    <>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="mt-2 h-3 w-40" />
    </>
  )
}

export function GrossCard() {
  composeGrossData()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gross</CardTitle>
        <Landmark className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ErrorBoundary fallback={<GrossCardErrorFallback />}>
          <Suspense fallback={<GrossCardSkeleton />}>
            <LoadGrossCard />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
