import { Suspense } from "react"
import { Users } from "lucide-react"
import { analytic } from "@/services/analytic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

interface CustomersData {
  current: number
  previous: number
  percentageChange: number
}
/**
 * Compose customer count data
 *
 * This function fetches the current and previous month's customer count data.
 * It calculates the current customer count by calling the analytic.customerCount method with the current month's start date.
 * It calculates the previous customer count by calling the analytic.customerCount method with the previous month's start date.
 * It then calculates the percentage change between the current and previous customer counts.
 *
 * @returns {Promise<CustomersData>} - The customers data for the current, previous month, and the percentage change.
 */
async function composeCustomersData(): Promise<CustomersData> {
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
    analytic.customerCount(currentMonthRange),
    analytic.customerCount(previousMonthRange),
  ])

  const percentageChange = ((current - previous) / previous) * 100

  return {
    current,
    previous,
    percentageChange,
  }
}

export async function LoadCustomersCard() {
  const customersData = await composeCustomersData()

  return (
    <>
      <div className="text-2xl font-bold">{customersData.current}</div>
      <p className="text-xs text-muted-foreground">
        {customersData.percentageChange >= 0 ? "+" : ""}
        {customersData.percentageChange.toFixed(1)}% from last month
      </p>
    </>
  )
}

function CustomersCardSkeleton() {
  return (
    <>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="mt-2 h-3 w-40" />
    </>
  )
}

function CustomersCardErrorFallback() {
  return <div className="text-red-500">Error loading customers</div>
}

export function CustomersCard() {
  composeCustomersData()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Customers</CardTitle>
        <Users className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ErrorBoundary fallback={<CustomersCardErrorFallback />}>
          <Suspense fallback={<CustomersCardSkeleton />}>
            <LoadCustomersCard />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
