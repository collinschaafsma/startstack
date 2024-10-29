"use client"

import { createContext, ReactNode, use, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Stripe from "stripe"

interface GenericData {
  id: string
}

export interface PaginatorContextInterface {
  showPaginator: boolean
  previousPageDisabled: boolean
  nextPageDisabled: boolean
  handleNextPage: () => void
  handlePrevPage: () => void
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hasMore, setHasMore] = useState(true)
  const [prevCursors, setPrevCursors] = useState<string[]>([])
  const cursor = searchParams.get("cursor")

  useEffect(() => {
    if (cursor) {
      setPrevCursors(prev => [...prev, cursor])
    } else {
      setPrevCursors([])
    }

    setHasMore(responseToPaginate?.has_more || false)
  }, [cursor])

  const handleNextPage = () => {
    if (responseToPaginate?.data.length) {
      const lastCustomerId =
        responseToPaginate.data[responseToPaginate.data.length - 1].id
      const params = new URLSearchParams(searchParams)
      params.set("cursor", lastCustomerId)
      router.push(`?${params.toString()}`)
    }
  }

  const handlePrevPage = () => {
    if (prevCursors.length > 0) {
      const newPrevCursors = [...prevCursors]
      const prevCursor = newPrevCursors.pop() // Remove the current cursor
      setPrevCursors(newPrevCursors)

      const params = new URLSearchParams(searchParams)
      if (prevCursor && newPrevCursors.length > 0) {
        params.set("cursor", newPrevCursors[newPrevCursors.length - 1])
      } else {
        params.delete("cursor")
      }
      router.push(`?${params.toString()}`)
    }
  }

  const previousPageDisabled = prevCursors.length === 0
  const nextPageDisabled = !hasMore
  const showPaginator = !previousPageDisabled && !nextPageDisabled

  return (
    <PaginatorContext.Provider
      value={{
        showPaginator,
        previousPageDisabled,
        nextPageDisabled,
        handleNextPage,
        handlePrevPage,
      }}
    >
      {children}
    </PaginatorContext.Provider>
  )
}
