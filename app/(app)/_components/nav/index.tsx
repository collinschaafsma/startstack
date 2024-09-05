import Link from "next/link"
import { Home, Lock, PanelLeft } from "lucide-react"
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
import Logo from "@/components/logo"
import { DesktopNavLink, MobileNavLink } from "./link"
import MobileSheet from "./mobile-sheet"

export function DesktopNav() {
  return (
    <TooltipProvider>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          className="flex items-center justify-center"
          href="/"
          prefetch={false}
        >
          <Logo className="size-6" />
          <span className="sr-only">{appName}</span>
        </Link>
        <AuthBoundary>
          <Tooltip>
            <TooltipTrigger>
              <DesktopNavLink href="/account">
                <Home className="size-5" />
                <span className="sr-only">Account</span>
              </DesktopNavLink>
            </TooltipTrigger>
            <TooltipContent side="right">Account</TooltipContent>
          </Tooltip>
        </AuthBoundary>
        <AdminBoundary>
          <Tooltip>
            <TooltipTrigger>
              <DesktopNavLink href="/admin">
                <Lock className="size-5" />
                <span className="sr-only">Admin</span>
              </DesktopNavLink>
            </TooltipTrigger>
            <TooltipContent side="right">Admin</TooltipContent>
          </Tooltip>
        </AdminBoundary>
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
          <AuthBoundary>
            <MobileNavLink href="/account">
              <Home className="size-5" />
              Account
            </MobileNavLink>
          </AuthBoundary>
          <AdminBoundary>
            <MobileNavLink href="/admin">
              <Lock className="size-5" />
              Admin
            </MobileNavLink>
          </AdminBoundary>
        </nav>
      </SheetContent>
    </MobileSheet>
  )
}
