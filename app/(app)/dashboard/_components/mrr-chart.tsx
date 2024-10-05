"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const mrrData = [
  { month: "Jan", mrr: 10000 },
  { month: "Feb", mrr: 12000 },
  { month: "Mar", mrr: 14000 },
  { month: "Apr", mrr: 16000 },
  { month: "May", mrr: 18000 },
  { month: "Jun", mrr: 22000 },
  { month: "Jul", mrr: 25000 },
  { month: "Aug", mrr: 28000 },
  { month: "Sep", mrr: 30000 },
  { month: "Oct", mrr: 32000 },
]

export function MRRChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>MRR Growth</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={{
            mrr: {
              label: "MRR",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mrrData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="mrr"
                stroke="var(--color-mrr)"
                fill="var(--color-mrr)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
