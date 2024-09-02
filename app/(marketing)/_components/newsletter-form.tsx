/*
Here is an example of using useActionState and useOptimistic together.

useActionState is a Hook that allows you to update state based on the result of a form action.
useOptimistic is a Hook that lets you show a different state while an async action is underway

In this example, we are using useActionState to execute an action that is a server action called subscribeToNewsletter.
We are using useOptimistic to provide an optimistic update to the UI.

Keep in mind this is sorta a silly example because we are not fully utilizing useOptimistic
and appending or possibly rolling back data (on error) that we are showing in the UI. In this example you could achieve
the same results with just useState. However, this is still a bit cleaner and gives you a good idea of how to use these
two hooks together and provide instant feedback to the user.

see: https://react.dev/reference/react/useOptimistic
see: https://react.dev/reference/react/useActionState
*/

"use client"

import { useActionState, useEffect, useOptimistic, useState } from "react"
import { subscribeToNewsletter } from "@/actions/newsletter"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterForm() {
  const [hasError, setHasError] = useState<boolean>(false)

  const [optimisticEmail, addOptimisticEmail] = useOptimistic(
    "",
    (_state, newEmail: string) => newEmail
  )

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const email = formData.get("email") as string
      addOptimisticEmail(email)

      try {
        await subscribeToNewsletter(email)
        return { success: true, email }
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
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [hasError])

  return (
    <div className="md:ml-auto">
      <h3 className="font-semibold">Newsletter</h3>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Subscribe to get the latest news and updates.
      </p>
      {!optimisticEmail && !hasError ? (
        <form className="flex" action={formAction}>
          <div className="mt-4 flex w-full items-center md:ml-auto">
            <Input
              className="flex-1"
              placeholder="Enter your email"
              type="email"
              name="email"
              id="email"
              required
            />
            <Button
              type="submit"
              aria-disabled={isPending}
              disabled={isPending}
              className="ml-2"
            >
              Sign Up
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex h-10 flex-col items-center justify-center">
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
              : `Subscribing ${optimisticEmail}`}
          </p>
          <p aria-live="polite" className="sr-only" role="status">
            {hasError
              ? "Something went wrong. Please try again."
              : `Subscribing ${optimisticEmail}`}
          </p>
        </div>
      )}
    </div>
  )
}
