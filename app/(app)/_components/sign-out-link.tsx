"use client"

import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { signOutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"

export function SignOutLink() {
  const router = useRouter()

  async function signOut() {
    await signOutAction()
    posthog.reset()
    router.refresh()
  }
  return (
    <form action={signOut} className="size-full p-0">
      <Button
        variant="link"
        type="submit"
        className="size-full p-0 hover:no-underline"
      >
        Sign out
      </Button>
    </form>
  )
}
