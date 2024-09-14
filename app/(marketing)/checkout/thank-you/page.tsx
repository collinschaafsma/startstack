import Link from "next/link"
import { unstable_after as after } from "next/server"
import { checkout } from "@/services/checkout"
import captureEvent from "@/lib/capture-event"
import { appName } from "@/lib/constants"
import { logger } from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { AuthBoundary } from "@/components/boundaries"

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: { id: string | undefined }
}) {
  const checkoutResponse = await checkout.sessions.get({
    sessionId: searchParams.id as string,
  })

  if (checkoutResponse.status !== "success" || !checkoutResponse.session) {
    logger.error("[ThankYouPage]", { checkoutResponse })

    return <div>Something didn&apos;t work. Please try again.</div>
  }

  if (checkoutResponse.session.status !== "complete") {
    logger.error("[ThankYouPage]", { checkoutResponse })

    return <div>Unable to process your payment. Please try again.</div>
  }

  // capture the event in posthog
  after(async () => {
    if (
      checkoutResponse.status === "success" &&
      checkoutResponse.session.status === "complete"
    ) {
      await captureEvent({
        event: "checkout_session_completed",
        properties: {
          priceId: checkoutResponse.session.line_items?.data[0].price?.id,
          amountTotal: checkoutResponse.session.amount_total,
          stripeCustomerId: checkoutResponse.session.customer,
          sessionId: checkoutResponse.session.id,
        },
      })
    }
  })

  return (
    <div className="container px-4 md:px-6">
      <div className="mt-6 flex flex-col items-center justify-center text-center md:mt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Thank you!
          </h2>
          <AuthBoundary
            alternate={
              <p className="mx-auto max-w-[600px] text-sm text-gray-500 dark:text-gray-400 md:text-xl">
                You are minutes away from getting started with {appName}. An
                email was sent to{" "}
                <strong>
                  {checkoutResponse.session.customer_details?.email}
                </strong>{" "}
                with a magic link to login.
              </p>
            }
          >
            <p className="mx-auto max-w-[600px] text-sm text-gray-500 dark:text-gray-400 md:text-xl">
              <Button asChild>
                <Link href="/account">Go to your account</Link>
              </Button>
            </p>
          </AuthBoundary>
        </div>
      </div>
    </div>
  )
}
