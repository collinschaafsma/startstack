import { Suspense } from "react"
import { DollarSign } from "lucide-react"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

interface MRRData {
  current: number
  previous: number
  percentageChange: number
}

async function calculateMRR(timestamp: number): Promise<number> {
  const subscriptions = await stripe.subscriptions.list({
    status: "active",
    created: { lte: timestamp },
    expand: ["data.plan"],
  })

  const mrr = subscriptions.data.reduce((acc, subscription) => {
    const plan = subscription.items.data[0].plan as Stripe.Plan
    if (plan.interval === "month") {
      return acc + (plan.amount ?? 0)
    } else if (plan.interval === "year") {
      return acc + (plan.amount ?? 0) / 12
    }
    return acc
  }, 0)

  return Math.round(mrr / 100)
}

async function fetchMRRData(): Promise<MRRData> {
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [currentMRR, previousMRR] = await Promise.all([
    calculateMRR(currentMonthStart.getTime() / 1000),
    calculateMRR(previousMonthStart.getTime() / 1000),
  ])

  const percentageChange = ((currentMRR - previousMRR) / previousMRR) * 100

  return {
    current: currentMRR,
    previous: previousMRR,
    percentageChange: percentageChange,
  }
}

export async function LoadMRRCard() {
  const mrrData = await fetchMRRData()
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

function MRRCardError() {
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
    <ErrorBoundary fallback={<MRRCardError />}>
      <Suspense fallback={<MRRCardSkeleton />}>
        <LoadMRRCard />
      </Suspense>
    </ErrorBoundary>
  )
}
