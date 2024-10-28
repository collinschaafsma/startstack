"use client"

import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePaginator } from "./use-paginator"

export function Paginator() {
  const { previousPageDisabled, nextPageDisabled, previousPage, nextPage } =
    usePaginator()

  return (
    <div className="flex w-full items-center justify-center space-x-2">
      <Button
        asChild
        variant="outline"
        className={cn(
          "size-8 p-0",
          previousPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <Link
          href={`/account?cursor=${previousPage}&direction=backward`}
          aria-disabled={previousPageDisabled}
          tabIndex={previousPageDisabled ? -1 : 0}
          className={previousPageDisabled ? "pointer-events-none" : ""}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="size-4" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className={cn(
          "size-8 p-0",
          nextPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <Link
          href={`/account?cursor=${nextPage}&direction=forward`}
          aria-disabled={nextPageDisabled}
          tabIndex={nextPageDisabled ? -1 : 0}
          className={nextPageDisabled ? "pointer-events-none" : ""}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
