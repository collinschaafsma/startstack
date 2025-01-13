"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useNav } from "./use-nav"

export function DesktopNavLink({
  children,
  href,
  className,
}: Readonly<{
  children: React.ReactNode
  href: string
  className?: string
}>) {
  const { isActiveLink } = useNav()
  const active = isActiveLink(href)

  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors md:size-8",
        active && "bg-accent text-accent-foreground",
        className
      )}
    >
      {children}
    </Link>
  )
}

export function MobileNavLink({
  children,
  href,
  className,
}: Readonly<{
  children: React.ReactNode
  href: string
  className?: string
}>) {
  const { isActiveLink, closeNav } = useNav()
  const active = isActiveLink(href)

  return (
    <Link
      onClick={closeNav}
      href={href}
      className={cn(
        "text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5",
        active && "text-foreground",
        className
      )}
    >
      {children}
    </Link>
  )
}
