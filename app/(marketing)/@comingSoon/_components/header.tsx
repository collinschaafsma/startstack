import Link from "next/link"
import { appName } from "@/lib/constants"
import Logo from "@/components/logo"
import ThemeToggle from "@/components/theme-toggle"

export default async function Header() {
  return (
    <header className="flex h-14 items-center px-4 lg:px-6">
      <div className="flex w-full items-center justify-between px-4 md:container md:px-0">
        <Link
          className="flex items-center justify-center"
          href="/"
          prefetch={false}
        >
          <Logo />
          <span className="ml-4 font-bold">{appName}</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
