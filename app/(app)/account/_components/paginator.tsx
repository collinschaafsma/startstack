"use client"

import { ChevronLeftIcon, ChevronRightIcon, LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePaginator } from "./use-paginator"

export function Paginator() {
  const {
    showPaginator,
    prevPageDisabled,
    nextPageDisabled,
    handlePrevPage,
    handleNextPage,
    isPending,
    isPendingPrev,
    isPendingNext,
  } = usePaginator()

  if (!showPaginator) return null

  return (
    <div className="flex w-full items-center justify-center space-x-2">
      <Button
        onClick={handlePrevPage}
        disabled={prevPageDisabled || isPending}
        variant="outline"
        className={cn(
          "size-8 p-0",
          prevPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <span className="sr-only">Go to previous page</span>
        {isPending && isPendingPrev ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <ChevronLeftIcon className="size-4" />
        )}
      </Button>
      <Button
        onClick={handleNextPage}
        disabled={nextPageDisabled || isPending}
        variant="outline"
        className={cn(
          "size-8 p-0",
          nextPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <span className="sr-only">Go to next page</span>
        {isPending && isPendingNext ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <ChevronRightIcon className="size-4" />
        )}
      </Button>
    </div>
  )
}
