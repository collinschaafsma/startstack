"use client"

import { useActionState, useEffect, useOptimistic, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { signUpAction } from "@/actions/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GoogleIcon } from "@/components/google-icon"

export default function SignUpForm({
  enabledProviders,
}: {
  enabledProviders: string[]
}) {
  const [hasError, setHasError] = useState<boolean>(false)
  const [keepFormHidden, setKeepFormHidden] = useState<boolean>(false)
  const [isPendingEmail, setIsPendingEmail] = useState(false)
  const [isPendingGoogle, setIsPendingGoogle] = useState(false)
  const searchParams = useSearchParams()

  const [optimisticSignUp, addOptimisticSignUp] = useOptimistic(
    "",
    (_state, newSignUp: string) => newSignUp
  )

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const email = formData.get("email") as string
      const redirectTo = formData.get("redirectTo") as string
      const provider = formData.get("provider") as string

      addOptimisticSignUp(provider)

      if (provider === "resend") {
        setKeepFormHidden(true)
      }

      try {
        await signUpAction({ email, redirectTo, provider })
        return { success: true }
      } catch (error) {
        setHasError(true)
        return { success: false, error: (error as Error).message }
      }
    },
    null
  )

  // Clear error after 3 seconds
  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        setHasError(false)
        setKeepFormHidden(false)
        setIsPendingEmail(false)
        setIsPendingGoogle(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [hasError])

  return (
    <>
      {!optimisticSignUp && !hasError && !keepFormHidden ? (
        <form className={"space-y-4"} action={formAction}>
          {enabledProviders.includes("google") && (
            <Button
              onClick={() => {
                setIsPendingGoogle(true)
              }}
              type="submit"
              aria-disabled={isPending}
              disabled={isPending}
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              name="provider"
              value="google"
            >
              {isPendingGoogle ? (
                <LoaderCircle className="mr-2 inline-block animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue With Google
            </Button>
          )}
          {enabledProviders.includes("resend") && (
            <>
              <div className="relative mb-2 w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              <Input
                type="hidden"
                name="redirectTo"
                id="redirectTo"
                value={searchParams.get("redirectTo") ?? "/"}
              />
              <div className="space-y-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="me@example.com"
                  type="email"
                  name="email"
                  id="email"
                />
              </div>
              <Button
                onClick={() => {
                  setIsPendingEmail(true)
                }}
                type="submit"
                aria-disabled={isPending}
                disabled={isPending}
                className="w-full"
                name="provider"
                value="resend"
              >
                {isPendingEmail && (
                  <LoaderCircle className="mr-2 inline-block animate-spin" />
                )}
                Continue With Email
              </Button>
              <p className="flex w-full justify-center rounded-md border border-gray-300 bg-muted p-4 text-sm text-gray-500 dark:text-gray-400 md:text-xs">
                We&apos;ll email you a magic link for a password-free sign in.
              </p>
              <p className="flex w-full text-sm text-gray-500 dark:text-gray-400 md:text-xs">
                Already have an account?{" "}
                <Link href="/sign-in" className="pl-2 text-primary underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </form>
      ) : (
        <>
          <p
            className={cn(
              "text-sm text-green-500 transition-opacity duration-300 ease-in-out dark:text-green-400",
              {
                ["text-red-500 dark:text-red-400"]: hasError,
              }
            )}
          >
            {hasError
              ? "Something went wrong. Please try again."
              : optimisticSignUp === "google"
                ? "Connecting with Google..."
                : "Thank you! Check your email for a magic link."}
          </p>
          <p aria-live="polite" className="sr-only" role="status">
            {hasError
              ? "Something went wrong. Please try again."
              : optimisticSignUp === "google"
                ? "Connecting with Google..."
                : "Thank you! Check your email for a magic link."}
          </p>
        </>
      )}
    </>
  )
}
