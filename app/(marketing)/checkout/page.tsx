import { redirect } from "next/navigation"
import { checkout } from "@/services/checkout"
import { EmbeddedStripeForm } from "./_components/embedded-stripe-form"

export default async function CheckoutPage(
  props: {
    searchParams: Promise<{ p: string }>
  }
) {
  const searchParams = await props.searchParams;
  const { p } = searchParams

  // create a checkout session
  const { clientSecret, status } = await checkout.sessions.create({
    priceId: p,
  })

  if (status === "requiresSession") {
    redirect(`/sign-up?redirectTo=/checkout?p=${p}`)
  }

  if (!clientSecret) {
    // something went wrong, redirect to the home page and fail silently
    redirect("/")
  }

  return (
    <section className="size-full min-h-screen bg-white">
      <div className="m-auto w-full py-4 md:py-8">
        <EmbeddedStripeForm clientSecret={clientSecret} />
      </div>
    </section>
  )
}
