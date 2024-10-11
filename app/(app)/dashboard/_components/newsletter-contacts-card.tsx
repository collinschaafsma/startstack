import { Suspense } from "react"
import { Mail } from "lucide-react"
import { analytic } from "@/services/analytic"
import { resendAudienceId, resendEnabled } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

interface NewsletterContactsData {
  current: number
  previous: number
  percentageChange: number
}

/**
 * Compose Newsletter Contacts Data
 *
 * This function fetches the current and previous month's newsletter contacts data.
 * It calculates the current newsletter contacts by calling the analytic.newsletterContacts method with the current month's start timestamp.
 * It calculates the previous newsletter contacts by calling the analytic.newsletterContacts method with the previous month's start timestamp.
 * It then calculates the percentage change between the current and previous newsletter contacts.
 *
 * @returns {Promise<NewsletterContactsData>} - The newsletter contacts data for the current and previous month.
 */
async function composeNewsletterContactsData(): Promise<NewsletterContactsData> {
  const now = new Date()

  // from 1978 to now
  const currentMonthRange = {
    from: new Date(1978, 0, 1),
    to: now,
  }

  // from jan 1 to end of last month
  const previousMonthRange = {
    from: new Date(now.getFullYear(), 0, 1),
    to: new Date(now.getFullYear(), now.getMonth() - 1, 31),
  }

  const [current, previous] = await Promise.all([
    analytic.newsletterContacts(currentMonthRange),
    analytic.newsletterContacts(previousMonthRange),
  ])

  const percentageChange = ((current - previous) / previous) * 100

  return {
    current,
    previous,
    percentageChange,
  }
}

async function LoadNewsletterContactsCard() {
  const data = await composeNewsletterContactsData()

  return (
    <>
      <div className="text-2xl font-bold">{data.current}</div>
      <p className="text-xs text-muted-foreground">
        {data.percentageChange >= 0 ? "+" : ""}
        {data.percentageChange.toFixed(1)}% from last month
      </p>
    </>
  )
}

function NewsletterContactsCardSkeleton() {
  return (
    <>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="mt-2 h-3 w-40" />
    </>
  )
}

function NewsletterContactsCardErrorFallback() {
  return (
    <div className="text-red-500">Error loading Newsletter Contact Count</div>
  )
}

function ResendConfiguredBoundary({ children }: { children: React.ReactNode }) {
  if (!resendEnabled || !resendAudienceId) {
    return <div className="text-red-500">Resend not configured</div>
  }
  return <>{children}</>
}

export function NewsletterContactsCard() {
  composeNewsletterContactsData()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Newsletter Contacts
        </CardTitle>
        <Mail className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ErrorBoundary fallback={<NewsletterContactsCardErrorFallback />}>
          <ResendConfiguredBoundary>
            <Suspense fallback={<NewsletterContactsCardSkeleton />}>
              <LoadNewsletterContactsCard />
            </Suspense>
          </ResendConfiguredBoundary>
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
