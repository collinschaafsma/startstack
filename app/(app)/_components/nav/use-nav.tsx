import { useContext } from "react"
import { NavContext, NavContextInterface } from "./provider"

export default function useNav() {
  const context = useContext(NavContext) as NavContextInterface

  if (context === undefined) {
    throw new Error("useNav must be used inside the NavProvider")
  }

  return context
}
