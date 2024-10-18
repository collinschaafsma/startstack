import { Suspense } from "react"
import Link from "next/link"
import { currentUser } from "@/services/currentUser"
import { centsToCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SubscriptionCanceledBoundary } from "@/components/boundaries"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  CancelSubscriptionPortalButton,
  UpdateSubscriptionPortalButton,
} from "./portal-buttons"

function SubscriptionPlanSkeleton() {
  return (
    <>
      <CardContent className="flex justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-5 w-[80px]" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-5 w-[80px]" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="destructive" disabled>
          Cancel Subscription
        </Button>
        <Button disabled>Change Plan</Button>
      </CardFooter>
    </>
  )
}

function SubscriptionPlanErrorFallback() {
  return (
    <>
      <CardContent className="flex flex-col gap-2 text-destructive">
        <div className="flex">We are sorry.</div>
        <div className="flex text-sm">
          An error occurred while fetching subscription plan.
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button disabled>Cancel Subscription</Button>
        <Button disabled>Change Plan</Button>
      </CardFooter>
    </>
  )
}

function NoSubscriptionPlan() {
  return (
    <>
      <CardContent className="flex flex-col">
        <div className="flex">No subscription plan</div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button asChild>
          <Link href="/#pricing">Subscribe</Link>
        </Button>
      </CardFooter>
    </>
  )
}

async function LoadSubscriptionPlanCard() {
  const user = await currentUser.subscriptions({ limit: 1 })

  if (!user?.subscriptions || user.subscriptions.length === 0) {
    return <NoSubscriptionPlan />
  }
  const { price, currentPeriodEnd, cancelAtPeriodEnd } = user.subscriptions[0]

  return (
    <>
      <CardContent className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-sm">Price / {price.interval}</div>
          <div>{centsToCurrency(price.unitAmount, price.currency)}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-sm">
            {cancelAtPeriodEnd ? "Ending At" : "Renewal Date"}
          </div>
          <div>{currentPeriodEnd.toLocaleDateString()}</div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <SubscriptionCanceledBoundary>
          <CancelSubscriptionPortalButton>
            Cancel Subscription
          </CancelSubscriptionPortalButton>
        </SubscriptionCanceledBoundary>
        <UpdateSubscriptionPortalButton>
          {cancelAtPeriodEnd ? "Renew Plan" : "Change Plan"}
        </UpdateSubscriptionPortalButton>
      </CardFooter>
    </>
  )
}

export function SubscriptionPlanCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your subscription</CardDescription>
      </CardHeader>
      <ErrorBoundary fallback={<SubscriptionPlanErrorFallback />}>
        <Suspense fallback={<SubscriptionPlanSkeleton />}>
          <LoadSubscriptionPlanCard />
        </Suspense>
      </ErrorBoundary>
    </Card>
  )
}
