"use client"

import { createContext, ReactNode, useContext, useState } from "react"
import { PricingPlanInterval } from "@/drizzle/schema"

export interface SubscriptionIntervalContextInterface {
  setSubscriptionInterval: (interval: PricingPlanInterval) => void
  subscriptionInterval: PricingPlanInterval
  isMonthly: boolean
  isAnnual: boolean
}

export const SubscriptionIntervalContext =
  createContext<SubscriptionIntervalContextInterface | null>(null)

export function SubscriptionIntervalProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [subscriptionInterval, setSubscriptionInterval] =
    useState<PricingPlanInterval>("month")
  const isMonthly = subscriptionInterval === "month"
  const isAnnual = subscriptionInterval === "year"

  return (
    <SubscriptionIntervalContext.Provider
      value={{
        setSubscriptionInterval,
        subscriptionInterval,
        isMonthly,
        isAnnual,
      }}
    >
      {children}
    </SubscriptionIntervalContext.Provider>
  )
}

export function useSubscriptionInterval() {
  const context = useContext(
    SubscriptionIntervalContext
  ) as SubscriptionIntervalContextInterface

  if (context === undefined) {
    throw new Error(
      "useSubscriptionInterval must be used inside the SubscriptionIntervalProvider"
    )
  }

  return context
}

export function SubscriptionIntervalSwitch() {
  const { isAnnual, isMonthly, setSubscriptionInterval } =
    useSubscriptionInterval()

  return (
    <div className="flex items-center rounded-full bg-muted p-1">
      <button
        type="button"
        className={`rounded-full px-4 py-2 transition-colors ${
          isMonthly
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
        onClick={() => setSubscriptionInterval("month")}
      >
        Monthly
      </button>
      <button
        type="button"
        className={`rounded-full px-4 py-2 transition-colors ${
          isAnnual
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
        onClick={() => setSubscriptionInterval("year")}
      >
        Annually
      </button>
    </div>
  )
}

// Show the currently selected subscription interval
export function SubscriptionIntervalBoundary({
  children,
  priceInterval,
}: Readonly<{
  children: ReactNode
  priceInterval: PricingPlanInterval | null
}>) {
  const { subscriptionInterval } = useSubscriptionInterval()

  return <>{subscriptionInterval === priceInterval ? children : null}</>
}
