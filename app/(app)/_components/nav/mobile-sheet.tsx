"use client"

import { Sheet } from "@/components/ui/sheet"
import useNav from "./use-nav"

export default function MobileSheet({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { open, setOpen } = useNav()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children}
    </Sheet>
  )
}
