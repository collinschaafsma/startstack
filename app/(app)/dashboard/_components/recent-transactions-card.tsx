import { Suspense } from "react"
import { analytic } from "@/services/analytic"
import { invoice } from "@/services/invoice"
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

async function LoadRecentTransactions() {
  const now = new Date()
  const recentTransactions = await invoice.list({
    range: { from: new Date(now.getFullYear(), 0, 1), to: now },
    limit: 5,
  })

  if (recentTransactions.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={2}>No transactions found</TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {recentTransactions.map(transaction => (
        <TableRow key={transaction.id}>
          <TableCell className="hidden font-medium md:table-cell">
            {transaction.user.email}
          </TableCell>
          <TableCell>${transaction.amountPaid / 100}</TableCell>
          <TableCell className="text-right">{transaction.status}</TableCell>
        </TableRow>
      ))}
    </>
  )
}

function RecentTransactionsSkeleton() {
  return (
    <TableRow>
      <TableCell colSpan={2}>
        <Skeleton className="h-6 w-full" />
      </TableCell>
    </TableRow>
  )
}

function RecentTransactionsErrorFallback() {
  return (
    <TableRow>
      <TableCell colSpan={2}>
        <div className="text-red-500">Failed to load recent transactions</div>
      </TableCell>
    </TableRow>
  )
}

async function SalesThisMonth() {
  const salesCountThisMonth = await analytic.salesCount({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  return (
    <>
      You made {salesCountThisMonth}{" "}
      {salesCountThisMonth === 1 ? "sale" : "sales"} this month.
    </>
  )
}

function SalesThisMonthSkeleton() {
  return <>You made 0 sales this month.</>
}

export function RecentTransactionsCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          <ErrorBoundary fallback={null}>
            <Suspense fallback={<SalesThisMonthSkeleton />}>
              <SalesThisMonth />
            </Suspense>
          </ErrorBoundary>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] md:table-cell">
                Customer
              </TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ErrorBoundary fallback={<RecentTransactionsErrorFallback />}>
              <Suspense fallback={<RecentTransactionsSkeleton />}>
                <LoadRecentTransactions />
              </Suspense>
            </ErrorBoundary>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
