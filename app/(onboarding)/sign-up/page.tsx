import { Suspense } from "react"
import Link from "next/link"
import { providers } from "@/auth"
import { appName } from "@/lib/constants"
import { Logo } from "@/components/logo"
import SignUpForm from "./_components/sign-up-form"

export const metadata = {
  title: "Create account",
}

export default function SignUpPage() {
  if (providers.length === 0) {
    return (
      <div>
        No providers configured for authentication. Please check your
        environment variables.
      </div>
    )
  }

  const enabledProviders = providers.map(provider =>
    provider.name.toLowerCase()
  )

  return (
    <div className="mx-auto max-w-sm space-y-6 py-12">
      <div className="space-y-2 px-4 text-center md:px-6">
        <div className="flex flex-col items-center gap-8 pb-8">
          <Link
            className="flex items-center justify-center"
            href="/"
            prefetch={false}
          >
            <Logo className="size-12" />
            <span className="sr-only">{appName}</span>
          </Link>
          <h1 className="text-3xl font-bold">Sign up</h1>
        </div>
        <div className="space-y-4">
          <Suspense fallback={null}>
            <SignUpForm enabledProviders={enabledProviders} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
