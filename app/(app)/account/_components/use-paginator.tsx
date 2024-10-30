import { useContext } from "react"
import {
  PaginatorContext,
  PaginatorContextInterface,
} from "./paginator-provider"

export function usePaginator() {
  const context = useContext(PaginatorContext) as PaginatorContextInterface

  if (context === undefined) {
    throw new Error("usePaginator must be used inside the PaginatorProvider")
  }

  return context
}
