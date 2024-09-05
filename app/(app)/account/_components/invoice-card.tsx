import { Suspense } from "react"
import Link from "next/link"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ExternalLink,
} from "lucide-react"
import { currentUser } from "@/services/currentUser"
import { invoicesLimit } from "@/lib/constants"
import { centsToCurrency, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import LinkExternal from "@/components/link-external"

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

async function LoadInvoiceTableRows({ page }: Readonly<{ page: number }>) {
  const user = await currentUser.invoices({ page })

  if (!user?.invoices || user.invoices.length === 0) {
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
      {user.invoices.map(invoice => (
        <TableRow key={invoice.id}>
          <TableCell>
            <LinkExternal
              href={invoice.hostedInvoiceUrl ?? "#"}
              className="group font-medium"
            >
              <div className="flex flex-row items-center md:w-60">
                {invoice.invoiceNumber}
                <ExternalLink className="ml-1 hidden size-4 group-hover:block" />
              </div>
            </LinkExternal>
          </TableCell>
          <TableCell>{invoice.created.toLocaleDateString()}</TableCell>
          <TableCell>{centsToCurrency(invoice.amountPaid)}</TableCell>
          <TableCell className="hidden md:block">
            <Badge>{invoice.status}</Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

async function LoadPagination({ page }: Readonly<{ page: number }>) {
  const user = await currentUser.invoicesTotal()

  if (!user?.invoicesTotal) {
    return null
  }

  const totalPages = Math.ceil(user.invoicesTotal / invoicesLimit)
  const firstPageDisabled = page === 1
  const lastPageDisabled = totalPages === page
  const previousPageDisabled = page === 1
  const nextPageDisabled = totalPages === page
  const nextPage = page + 1
  const previousPage = page - 1

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex w-full items-center justify-center space-x-2">
      <Button
        asChild
        variant="outline"
        className={cn(
          "size-8 p-0",
          firstPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <Link
          href="/account?page=1"
          aria-disabled={firstPageDisabled}
          tabIndex={firstPageDisabled ? -1 : 0}
          className={firstPageDisabled ? "pointer-events-none" : ""}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeftIcon className="size-4" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className={cn(
          "size-8 p-0",
          previousPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <Link
          href={`/account?page=${previousPage}`}
          aria-disabled={previousPageDisabled}
          tabIndex={previousPageDisabled ? -1 : 0}
          className={previousPageDisabled ? "pointer-events-none" : ""}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="size-4" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className={cn(
          "size-8 p-0",
          nextPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <Link
          href={`/account?page=${nextPage}`}
          aria-disabled={nextPageDisabled}
          tabIndex={nextPageDisabled ? -1 : 0}
          className={nextPageDisabled ? "pointer-events-none" : ""}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="size-4" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className={cn(
          "size-8 p-0",
          lastPageDisabled && "bg-muted text-muted-foreground"
        )}
      >
        <Link
          href={`/account?page=${totalPages}`}
          aria-disabled={lastPageDisabled}
          tabIndex={lastPageDisabled ? -1 : 0}
          className={lastPageDisabled ? "pointer-events-none" : ""}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRightIcon className="size-4" />
        </Link>
      </Button>
    </div>
  )
}

export default function InvoiceCard({ page }: Readonly<{ page: number }>) {
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
              <LoadInvoiceTableRows page={page} />
            </Suspense>
          </ErrorBoundary>
        </Table>
      </CardContent>
      <CardFooter>
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <LoadPagination page={page} />
          </Suspense>
        </ErrorBoundary>
      </CardFooter>
    </Card>
  )
}
