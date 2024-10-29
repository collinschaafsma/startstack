"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePaginator } from "./use-paginator"

export function Paginator() {
  const {
    previousPageDisabled,
    nextPageDisabled,
    handlePrevPage,
    handleNextPage,
  } = usePaginator()

  return (
    <div className="flex w-full items-center justify-center space-x-2">
      <Button
        onClick={handlePrevPage}
        disabled={previousPageDisabled}
        variant="outline"
        className={cn(
          "size-8 p-0",
          previousPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeftIcon className="size-4" />
      </Button>
      <Button
        onClick={handleNextPage}
        disabled={nextPageDisabled}
        variant="outline"
        className={cn(
          "size-8 p-0",
          nextPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )
}
