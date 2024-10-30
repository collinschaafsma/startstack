"use client"

import {
  createContext,
  ReactNode,
  use,
  useEffect,
  useState,
  useTransition,
} from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface GenericData {
  id: string
}

export interface PaginatorContextInterface {
  showPaginator: boolean
  prevPageDisabled: boolean
  nextPageDisabled: boolean
  handleNextPage: () => void
  handlePrevPage: () => void
  isPending: boolean
  isPendingNext: boolean
  isPendingPrev: boolean
}

export const PaginatorContext = createContext<PaginatorContextInterface | null>(
  null
)

export function PaginatorProvider<T extends GenericData>({
  children,
  responseToPaginatePromise,
}: Readonly<{
  children: ReactNode
  responseToPaginatePromise: Promise<{ data: T[]; hasMore: boolean } | null>
}>) {
  const responseToPaginate = use(responseToPaginatePromise)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hasMore, setHasMore] = useState(true)
  const [prevCursors, setPrevCursors] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [isPendingNext, setIsPendingNext] = useState(false)
  const [isPendingPrev, setIsPendingPrev] = useState(false)
  const cursor = searchParams.get("cursor")

  useEffect(() => {
    if (cursor) {
      setPrevCursors(prev => [...prev, cursor])
    } else {
      setPrevCursors([])
    }

    setHasMore(responseToPaginate?.hasMore || false)
  }, [cursor])

  const handleNextPage = () => {
    if (responseToPaginate?.data.length) {
      setIsPendingNext(true)
      startTransition(() => {
        const lastCustomerId =
          responseToPaginate.data[responseToPaginate.data.length - 1].id
        const params = new URLSearchParams(searchParams)
        params.set("cursor", lastCustomerId)
        router.push(`?${params.toString()}`)
        setIsPendingNext(false)
      })
    }
  }

  const handlePrevPage = () => {
    if (prevCursors.length > 0) {
      setIsPendingPrev(true)
      startTransition(() => {
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
        setIsPendingPrev(false)
      })
    }
  }

  const prevPageDisabled = prevCursors.length === 0
  const nextPageDisabled = !hasMore
  const showPaginator = !prevPageDisabled && !nextPageDisabled

  return (
    <PaginatorContext.Provider
      value={{
        showPaginator,
        prevPageDisabled,
        nextPageDisabled,
        handleNextPage,
        handlePrevPage,
        isPending,
        isPendingNext,
        isPendingPrev,
      }}
    >
      {children}
    </PaginatorContext.Provider>
  )
}
