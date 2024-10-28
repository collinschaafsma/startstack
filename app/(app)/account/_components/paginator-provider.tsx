"use client"

import { createContext, ReactNode, use } from "react"
import { useSearchParams } from "next/navigation"
import Stripe from "stripe"

interface GenericData {
  id: string
}

export interface PaginatorContextInterface {
  showPaginator: boolean
  previousPageDisabled: boolean
  nextPageDisabled: boolean
  nextPage: string | null
  previousPage: string | null
}

export const PaginatorContext = createContext<PaginatorContextInterface | null>(
  null
)

export function PaginatorProvider<T extends GenericData>({
  children,
  responseToPaginatePromise,
}: Readonly<{
  children: ReactNode
  responseToPaginatePromise: Promise<Stripe.Response<Stripe.ApiList<T>> | null>
}>) {
  const responseToPaginate = use(responseToPaginatePromise)
  const searchParams = useSearchParams()
  const cursor = searchParams.get("cursor")
  const direction = searchParams.get("direction")

  const previousPageDisabled = !cursor
  const nextPageDisabled = !responseToPaginate?.has_more
  const showPaginator = !previousPageDisabled && !nextPageDisabled
  const nextPage = responseToPaginate?.data?.[0]?.id ?? null
  const previousPage =
    responseToPaginate?.data?.[responseToPaginate?.data?.length - 1]?.id ?? null

  return (
    <PaginatorContext.Provider
      value={{
        showPaginator,
        previousPageDisabled,
        nextPageDisabled,
        nextPage,
        previousPage,
      }}
    >
      {children}
    </PaginatorContext.Provider>
  )
}
