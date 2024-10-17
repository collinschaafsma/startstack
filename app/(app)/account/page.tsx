import { currentUser } from "@/services/currentUser"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Header } from "../_components/header"
import { InvoiceCard } from "./_components/invoice-card"
import { PaymentMethodCard } from "./_components/payment-method-card"
import { SubscriptionPlanCard } from "./_components/subscription-plan-card"

export const metadata = {
  title: "Account",
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { page: string }
}) {
  const { page } = await searchParams
  const pageNumber: number = page ? parseInt(page) : 1
  // Preload data for the account page
  currentUser.paymentMethods({ limit: 1 })
  currentUser.subscriptions({ limit: 1 })
  currentUser.invoices({ page: pageNumber })

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header>
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <main className="flex-1 p-6 md:p-4 md:py-0">
        <div className="grid gap-4 md:max-w-screen-xl md:grid-cols-2">
          <PaymentMethodCard />
          <SubscriptionPlanCard />
          <div className="flex flex-col gap-4 md:col-span-2">
            <InvoiceCard page={pageNumber} />
          </div>
        </div>
      </main>
    </div>
  )
}
