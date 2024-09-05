"use client"

import { useActionState } from "react"
import { LoaderCircle } from "lucide-react"
import {
  cancelSubscriptionViaBillingPortal,
  updatePaymentMethodViaBillingPortal,
  updateSubscriptionViaBillingPortal,
} from "@/actions/billingPortal"
import { Button } from "@/components/ui/button"

export function UpdatePaymentMethodPortalButton({
  children,
  className,
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) {
  const [_state, formAction, isPending] = useActionState(
    updatePaymentMethodViaBillingPortal,
    null
  )

  return (
    <form action={formAction}>
      <Button
        type="submit"
        className={className}
        aria-disabled={isPending}
        disabled={isPending}
      >
        {isPending && (
          <LoaderCircle className="mr-2 inline-block animate-spin" />
        )}
        {children}
      </Button>
    </form>
  )
}

export function CancelSubscriptionPortalButton({
  children,
  className,
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) {
  const [_state, formAction, isPending] = useActionState(
    cancelSubscriptionViaBillingPortal,
    null
  )

  return (
    <form action={formAction}>
      <Button
        type="submit"
        className={className}
        aria-disabled={isPending}
        disabled={isPending}
        variant="destructive"
      >
        {isPending && (
          <LoaderCircle className="mr-2 inline-block animate-spin" />
        )}
        {children}
      </Button>
    </form>
  )
}

export function UpdateSubscriptionPortalButton({
  children,
  className,
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) {
  const [_state, formAction, isPending] = useActionState(
    updateSubscriptionViaBillingPortal,
    null
  )

  return (
    <form action={formAction}>
      <Button
        type="submit"
        className={className}
        aria-disabled={isPending}
        disabled={isPending}
      >
        {isPending && (
          <LoaderCircle className="mr-2 inline-block animate-spin" />
        )}
        {children}
      </Button>
    </form>
  )
}
