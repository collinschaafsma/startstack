import { Suspense } from "react"
import { ExternalLink } from "lucide-react"
import { currentUser } from "@/services/currentUser"
import { centsToCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { LinkExternal } from "@/components/link-external"
import { Paginator } from "./paginator"
import { PaginatorProvider } from "./paginator-provider"

function InvoicesErrorFallback() {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={4} className="text-destructive">
          <div className="flex">We are sorry.</div>
          <div className="flex text-sm">
            An error occurred while fetching your invoices.
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}

function InvoicesSkeleton() {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={4}>
          <Skeleton className="h-10 w-full" />
        </TableCell>
      </TableRow>
    </TableBody>
  )
}

async function LoadInvoiceTableRows({
  cursor,
  direction,
}: Readonly<{ cursor: string; direction: "forward" | "backward" }>) {
  const invoices = await currentUser.invoices({ cursor, direction })

  if (!invoices || invoices.data.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={4}>
            <div className="flex">No invoices found</div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {invoices.data.map(invoice => (
        <TableRow key={invoice.id}>
          <TableCell>
            <LinkExternal
              href={invoice.hosted_invoice_url ?? "#"}
              className="group font-medium"
            >
              <div className="flex flex-row items-center md:w-60">
                {invoice.number}
                <ExternalLink className="ml-1 hidden size-4 group-hover:block" />
              </div>
            </LinkExternal>
          </TableCell>
          <TableCell>
            {new Date(invoice.created).toLocaleDateString()}
          </TableCell>
          <TableCell>{centsToCurrency(invoice.amount_paid)}</TableCell>
          <TableCell className="hidden md:block">
            <Badge>{invoice.status}</Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export function InvoiceCard({
  cursor,
  direction,
}: Readonly<{ cursor: string; direction: "forward" | "backward" }>) {
  const invoicesPromise = currentUser.invoices({ cursor, direction })
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>Latest Invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <ErrorBoundary fallback={<InvoicesErrorFallback />}>
            <Suspense fallback={<InvoicesSkeleton />}>
              <LoadInvoiceTableRows cursor={cursor} direction={direction} />
            </Suspense>
          </ErrorBoundary>
        </Table>
      </CardContent>
      <CardFooter>
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <PaginatorProvider responseToPaginatePromise={invoicesPromise}>
              <Paginator />
            </PaginatorProvider>
          </Suspense>
        </ErrorBoundary>
      </CardFooter>
    </Card>
  )
}
