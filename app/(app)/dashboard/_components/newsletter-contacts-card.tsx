import { Mail } from "lucide-react"
import { analytic } from "@/services/analytic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NewsletterContactsData {
  current: number
  previous: number
  percentageChange: number
}

async function composeNewsletterContactsData(): Promise<NewsletterContactsData> {
  const now = new Date()

  // from 1978 to now
  const currentMonthRange = {
    from: new Date(1978, 0, 1),
    to: now,
  }

  // from jan 1 to end of last month
  const previousMonthRange = {
    from: new Date(now.getFullYear(), 0, 1),
    to: new Date(now.getFullYear(), now.getMonth() - 1, 31),
  }

  const [current, previous] = await Promise.all([
    analytic.newsletterContacts(currentMonthRange),
    analytic.newsletterContacts(previousMonthRange),
  ])

  const percentageChange = ((current - previous) / previous) * 100

  return {
    current,
    previous,
    percentageChange,
  }
}

export async function NewsletterContactsCard() {
  const data = await composeNewsletterContactsData()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Newsletter Contacts
        </CardTitle>
        <Mail className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.current}</div>
        <p className="text-xs text-muted-foreground">
          {data.percentageChange >= 0 ? "+" : ""}
          {data.percentageChange.toFixed(1)}% from last month
        </p>
      </CardContent>
    </Card>
  )
}
