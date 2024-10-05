"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const pageViewsData = [
  { month: "Jan", pageViews: 10000 },
  { month: "Feb", pageViews: 12000 },
  { month: "Mar", pageViews: 14000 },
  { month: "Apr", pageViews: 16000 },
  { month: "May", pageViews: 18000 },
  { month: "Jun", pageViews: 22000 },
  { month: "Jul", pageViews: 25000 },
  { month: "Aug", pageViews: 28000 },
  { month: "Sep", pageViews: 30000 },
  { month: "Oct", pageViews: 32000 },
]

export function PageViewChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Page Views</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={{
            pageViews: {
              label: "Page Views",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pageViewsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="var(--color-pageViews)"
                fill="var(--color-pageViews)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
