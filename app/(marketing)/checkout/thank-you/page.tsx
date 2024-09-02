import { checkout } from "@/services/checkout"
import { logger } from "@/lib/logger"

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

  return (
    <div className="container px-4 md:px-6">
      <div className="mt-6 flex flex-col items-center justify-center text-center md:mt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Thank you!
          </h2>
        </div>
      </div>
    </div>
  )
}
