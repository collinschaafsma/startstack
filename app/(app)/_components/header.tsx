import { Suspense } from "react"
import Image from "next/image"
import ThemeToggle from "@/components/theme-toggle"
import Account from "./account"
import { MobileNav } from "./nav"

export default function Header({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent md:ml-4 md:max-w-screen-xl md:pl-2 md:pr-0">
      <MobileNav />
      {/* this allows you to optionally pass in other components like a breadcrumb or a search component from the page */}
      {children}
      <div className="flex items-center gap-4">
        <Suspense
          fallback={
            <Image
              src={"/placeholder-user.webp"}
              width={36}
              height={36}
              alt={"User Avatar"}
              loading="lazy"
              className="overflow-hidden rounded-full"
            />
          }
        >
          <Account />
        </Suspense>
        <ThemeToggle buttonClassName="rounded-full" />
      </div>
    </header>
  )
}
