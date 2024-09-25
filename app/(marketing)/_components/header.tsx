import Link from "next/link"
import { appName } from "@/lib/constants"
import { Logo } from "@/components/logo"

export function Header() {
  return (
    <header className="sticky top-0 flex items-center bg-gray-100 py-4 opacity-90 dark:bg-gray-800 lg:px-6">
      <div className="flex w-full items-center justify-between px-4 md:container md:px-0">
        <Link
          className="flex items-center justify-center"
          href="/"
          prefetch={false}
        >
          <Logo />
          <span className="ml-4 font-bold">{appName}</span>
        </Link>
      </div>
    </header>
  )
}
