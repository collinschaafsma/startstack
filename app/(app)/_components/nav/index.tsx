import Link from "next/link"
import { Gauge, PanelLeft, User } from "lucide-react"
import { appName } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AdminBoundary, AuthBoundary } from "@/components/boundaries"
import { Logo } from "@/components/logo"
import { DesktopNavLink, MobileNavLink } from "./link"
import { MobileSheet } from "./mobile-sheet"

export function DesktopNav() {
  return (
    <TooltipProvider>
      <nav className="flex h-full flex-col items-center justify-between px-2 sm:py-5">
        <div className="flex flex-col gap-4">
          <Link
            className="flex items-center justify-center"
            href="/"
            prefetch={false}
          >
            <Logo className="size-6" />
            <span className="sr-only">{appName}</span>
          </Link>
          <AdminBoundary>
            <Tooltip>
              <TooltipTrigger>
                <DesktopNavLink href="/dashboard">
                  <Gauge className="size-5" />
                  <span className="sr-only">Dashboard</span>
                </DesktopNavLink>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </AdminBoundary>
        </div>
        <div>
          <AuthBoundary>
            <Tooltip>
              <TooltipTrigger>
                <DesktopNavLink href="/account">
                  <User className="size-5" />
                  <span className="sr-only">Account</span>
                </DesktopNavLink>
              </TooltipTrigger>
              <TooltipContent side="right">Account</TooltipContent>
            </Tooltip>
          </AuthBoundary>
        </div>
      </nav>
    </TooltipProvider>
  )
}

export function MobileNav() {
  return (
    <MobileSheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link href="/">
            <Logo className="size-6" />
            <span className="sr-only">{appName}</span>
          </Link>
          <AdminBoundary>
            <MobileNavLink href="/dashboard">
              <Gauge className="size-5" />
              Dashboard
            </MobileNavLink>
          </AdminBoundary>
          <AuthBoundary>
            <MobileNavLink href="/account">
              <User className="size-5" />
              Account
            </MobileNavLink>
          </AuthBoundary>
        </nav>
      </SheetContent>
    </MobileSheet>
  )
}
