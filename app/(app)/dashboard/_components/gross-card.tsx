import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GrossCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gross</CardTitle>
        <ShoppingCart className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$345,000</div>
        <p className="text-xs text-muted-foreground">+15.5% from last month</p>
      </CardContent>
    </Card>
  )
}
