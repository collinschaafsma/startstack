import { Suspense } from "react"
import Link from "next/link"
import { CheckIcon } from "lucide-react"
import { Metadata } from "@/drizzle/schema"
import { product } from "@/services/product"
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
import {
  SubscriptionIntervalBoundary,
  SubscriptionIntervalProvider,
  SubscriptionIntervalSwitch,
} from "./subscription-interval"

async function LoadProducts() {
  const products = await product.getAll()
  if (!products) {
    return (
      <div>
        No active products found. Login to your stripe account and add products
        and prices.
      </div>
    )
  }

  return (
    <>
      {products.oneTimeProducts && products.oneTimeProducts.length > 0 && (
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Purchase
              </h2>
              <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Copy here
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="grid max-w-5xl place-content-center place-items-center gap-4 md:auto-cols-max md:grid-flow-col">
              {products.oneTimeProducts.map(product => (
                <Card key={product.id} className="w-[300px]">
                  <CardHeader className="border-b border-gray-200 pb-4 dark:border-gray-800">
                    <CardTitle className="text-2xl font-bold">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 py-6">
                    <div
                      key={product.prices[0].id}
                      className="flex items-center gap-4 text-4xl font-bold"
                    >
                      {centsToCurrency(
                        product.prices[0].unitAmount,
                        product.prices[0].currency
                      )}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        /one time
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      {product.marketingFeatures.map(feature => (
                        <li key={feature}>
                          <CheckIcon className="mr-2 inline-block size-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      key={product.prices[0].id}
                      className="w-full"
                      asChild
                    >
                      <Link href={`/checkout?p=${product.prices[0].id}`}>
                        Purchase
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {products.recurringProducts && products.recurringProducts.length > 0 && (
        <SubscriptionIntervalProvider>
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Pricing
                </h2>
                <div className="flex justify-center pt-6">
                  <SubscriptionIntervalSwitch />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="grid max-w-5xl place-content-center place-items-center gap-4 md:auto-cols-max md:grid-flow-col">
                {products.recurringProducts.map(product => (
                  <Card key={product.id} className="relative w-[300px]">
                    {product.prices.map(price => (
                      <SubscriptionIntervalBoundary
                        key={price.id}
                        priceInterval={price.interval}
                      >
                        {(price.metadata as Metadata)["trialPeriodDays"] && (
                          <div className="absolute right-0 top-0 size-[200px] overflow-hidden">
                            <div className="absolute right-[-80px] top-[30px] w-[280px] rotate-45 bg-yellow-400 py-1 text-center text-xs font-bold text-yellow-900 shadow-md">
                              <span className="block w-full pl-8">
                                {
                                  (price.metadata as Metadata)[
                                    "trialPeriodDays"
                                  ]
                                }
                                -DAY FREE TRIAL
                              </span>
                            </div>
                          </div>
                        )}
                      </SubscriptionIntervalBoundary>
                    ))}
                    <CardHeader className="border-b border-gray-200 pb-4 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">
                          {product.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 py-6">
                      {product.prices.map(price => (
                        <SubscriptionIntervalBoundary
                          key={price.id}
                          priceInterval={price.interval}
                        >
                          <div className="flex items-center gap-4 text-4xl font-bold">
                            {centsToCurrency(price.unitAmount, price.currency)}{" "}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{price.interval}
                            </span>
                          </div>
                        </SubscriptionIntervalBoundary>
                      ))}
                      <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        {product.marketingFeatures.map(feature => (
                          <li key={feature}>
                            <CheckIcon className="mr-2 inline-block size-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      {product.prices.map(price => (
                        <SubscriptionIntervalBoundary
                          key={price.id}
                          priceInterval={price.interval}
                        >
                          <Button className="w-full" asChild>
                            <Link href={`/checkout?p=${price.id}`}>
                              {(price.metadata as Metadata)["trialPeriodDays"]
                                ? "Start Free Trial"
                                : "Subscribe"}
                            </Link>
                          </Button>
                        </SubscriptionIntervalBoundary>
                      ))}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </SubscriptionIntervalProvider>
      )}
    </>
  )
}

function ProductsSkeleton() {
  return (
    <div className="container space-y-12 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </div>
      </div>
      <div className="grid auto-cols-max grid-flow-col justify-center gap-6">
        <Card className="w-[300px]">
          <CardHeader className="border-b border-gray-200 pb-4 dark:border-gray-800">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4 py-6">
            <div className="text-center text-4xl font-bold">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={true} asChild>
              Purchase
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export function Products() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <LoadProducts />
    </Suspense>
  )
}
