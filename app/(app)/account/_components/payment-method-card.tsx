import { Suspense } from "react"
import { currentUser } from "@/services/currentUser"
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
import { ErrorBoundary } from "@/components/error-boundary"
import { UpdatePaymentMethodPortalButton } from "./portal-buttons"

function PaymentMethodCardSkeleton() {
  return (
    <>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-[180px]" />
        </div>
        <Skeleton className="h-4 w-[100px]" />
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled>Change Payment Method</Button>
      </CardFooter>
    </>
  )
}

function PaymentMethodCardErrorFallback() {
  return (
    <>
      <CardContent className="flex flex-col gap-2 text-destructive">
        <div className="flex">We are sorry.</div>
        <div className="flex text-sm">
          An error occurred while fetching payment methods.
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled>Change Payment Method</Button>
      </CardFooter>
    </>
  )
}

function NoPaymentMethod() {
  return (
    <>
      <CardContent className="flex flex-col">
        <div className="flex">No payment method on file</div>
      </CardContent>
      <CardFooter className="justify-end">
        <UpdatePaymentMethodPortalButton>
          Add Payment Method
        </UpdatePaymentMethodPortalButton>
      </CardFooter>
    </>
  )
}

async function LoadPaymentMethodCard() {
  const user = await currentUser.paymentMethods({
    limit: 1,
  })

  if (!user?.paymentMethods || user.paymentMethods.length === 0) {
    return <NoPaymentMethod />
  }

  const { brand, expMonth, expYear, last4 } = user.paymentMethods[0]

  return (
    <>
      <CardContent className="flex flex-col gap-2">
        <div className="flex">
          <div>
            {brand.toUpperCase()} ending in {last4}
          </div>
        </div>
        <div className="flex text-sm">
          {expMonth} / {expYear}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <UpdatePaymentMethodPortalButton>
          Change Payment Method
        </UpdatePaymentMethodPortalButton>
      </CardFooter>
    </>
  )
}

export default function PaymentMethodCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Manage your payment details</CardDescription>
      </CardHeader>
      <ErrorBoundary fallback={<PaymentMethodCardErrorFallback />}>
        <Suspense fallback={<PaymentMethodCardSkeleton />}>
          <LoadPaymentMethodCard />
        </Suspense>
      </ErrorBoundary>
    </Card>
  )
}
