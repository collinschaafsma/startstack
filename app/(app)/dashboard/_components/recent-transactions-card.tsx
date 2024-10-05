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

export function RecentTransactionsCard({ className }: { className?: string }) {
  const recentTransactions = [
    { id: 1, email: "johndoe@example.com", amount: 1200, status: "Completed" },
    { id: 2, email: "janedoe@example.com", amount: 850, status: "Pending" },
    { id: 3, email: "jimsmith@example.com", amount: 2300, status: "Completed" },
    { id: 4, email: "jilljones@example.com", amount: 1750, status: "Failed" },
    {
      id: 5,
      email: "mikebrown@example.com",
      amount: 3100,
      status: "Completed",
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.email}
                </TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell className="text-right">
                  {transaction.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
