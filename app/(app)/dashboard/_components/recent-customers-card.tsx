import { Suspense } from "react"
import { analytic } from "@/services/analytic"
import { customer } from "@/services/customer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ErrorBoundary } from "@/components/error-boundary"

async function LoadRecentCustomers() {
  const recentCustomers = await customer.list({
    range: { from: new Date(1978, 0, 1), to: new Date() },
    limit: 5,
  })

  if (recentCustomers.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={2}>No customers found</TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {recentCustomers.map(customer => (
        <TableRow key={customer.userId}>
          <TableCell className="font-medium">{customer.user.email}</TableCell>
          <TableCell className="hidden text-right md:table-cell">
            {customer.created.toLocaleDateString()}
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function RecentCustomersSkeleton() {
  return (
    <TableRow>
      <TableCell colSpan={2}>
        <Skeleton className="h-6 w-full" />
      </TableCell>
    </TableRow>
  )
}

function RecentCustomersErrorFallback() {
  return (
    <TableRow>
      <TableCell colSpan={2}>
        <div className="text-red-500">Failed to load recent customers</div>
      </TableCell>
    </TableRow>
  )
}

async function GainedCustomersThisMonth() {
  const [customerCount, customerCountThisMonth] = await Promise.all([
    analytic.customerCount({
      from: new Date(1978, 0, 1),
      to: new Date(),
    }),
    analytic.customerCount({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    }),
  ])

  return (
    <>
      You gained {customerCount - customerCountThisMonth} customers this month.
    </>
  )
}

function GainedCustomersThisMonthSkeleton() {
  return <>You gained 0 customers this month.</>
}

export function RecentCustomersCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>
          <ErrorBoundary fallback={null}>
            <Suspense fallback={<GainedCustomersThisMonthSkeleton />}>
              <GainedCustomersThisMonth />
            </Suspense>
          </ErrorBoundary>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Customer</TableHead>
              <TableHead className="hidden text-right md:table-cell">
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ErrorBoundary fallback={<RecentCustomersErrorFallback />}>
              <Suspense fallback={<RecentCustomersSkeleton />}>
                <LoadRecentCustomers />
              </Suspense>
            </ErrorBoundary>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
