import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Header } from "../_components/header"
import { CustomersCard } from "./_components/customers-card"
import { GrossCard } from "./_components/gross-card"
import { MRRCard } from "./_components/mrr-card"
import { MRRChartCard } from "./_components/mrr-chart-card"
import { NetCard } from "./_components/net-card"
import { PageViewChart } from "./_components/page-view-chart"
import { RecentCustomersCard } from "./_components/recent-customers-card"
import { RecentTransactionsCard } from "./_components/recent-transactions-card"

export const metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header>
        <>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      </Header>
      <main className="flex-1 p-6 md:p-4 md:py-0">
        <div className="grid gap-4 md:max-w-screen-xl md:grid-cols-4">
          <MRRCard />
          <GrossCard />
          <NetCard />
          <CustomersCard />
          <MRRChartCard className="md:col-span-2" />
          <PageViewChart className="md:col-span-2" />
          <RecentTransactionsCard className="md:col-span-2" />
          <RecentCustomersCard className="md:col-span-2" />
        </div>
      </main>
    </div>
  )
}
