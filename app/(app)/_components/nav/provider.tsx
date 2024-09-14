"use client"

import { createContext, ReactNode, useState } from "react"
import { useSelectedLayoutSegments } from "next/navigation"

export interface NavContextInterface {
  isActiveLink: (href: string) => boolean
  closeNav: () => void
  open: boolean
  setOpen: (open: boolean) => void
}

export const NavContext = createContext<NavContextInterface | null>(null)

export function NavProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [open, setOpen] = useState(false)
  const segments = useSelectedLayoutSegments()

  function isActiveLink(href: string) {
    const currentPath = `/${segments?.join("/")}`
    return currentPath.includes(href)
  }

  function closeNav() {
    setOpen(false)
  }

  return (
    <NavContext.Provider
      value={{
        isActiveLink,
        closeNav,
        open,
        setOpen,
      }}
    >
      {children}
    </NavContext.Provider>
  )
}
