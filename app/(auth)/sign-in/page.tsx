import { Suspense } from "react"
import Link from "next/link"
import { providers } from "@/auth"
import { appName } from "@/lib/constants"
import Logo from "@/components/logo"
import SignInForm from "./_components/sign-in-form"

export const metadata = {
  title: "Sign In",
}

export default function SignInPage() {
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
    <div className="mx-auto max-w-[400px] space-y-6 py-12">
      <div className="space-y-2 text-center">
        <div className="flex flex-col items-center gap-8 pb-8">
          <Link
            className="flex items-center justify-center"
            href="/"
            prefetch={false}
          >
            <Logo className="size-12" />
            <span className="sr-only">{appName}</span>
          </Link>
          <h1 className="text-3xl font-bold">Sign In</h1>
        </div>
        <div className="space-y-4">
          <Suspense fallback={null}>
            <SignInForm enabledProviders={enabledProviders} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
