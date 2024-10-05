import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function RecentCustomersCard({ className }: { className?: string }) {
  const recentCustomers = [
    {
      id: 1,
      email: "johndoe@example.com",
      createdAt: new Date(),
    },
    {
      id: 2,
      email: "janedoe@example.com",
      createdAt: new Date(),
    },
    {
      id: 3,
      email: "jimsmith@example.com",
      createdAt: new Date(),
    },
    {
      id: 4,
      email: "jilljones@example.com",
      createdAt: new Date(),
    },
    {
      id: 5,
      email: "mikebrown@example.com",
      createdAt: new Date(),
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>You gained 265 customers this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Customer</TableHead>
              <TableHead className="text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCustomers.map(customer => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.email}</TableCell>
                <TableCell className="text-right">
                  {customer.createdAt.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
