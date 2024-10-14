"use client"

import { use } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function PageViewChart({
  dataPromise,
}: {
  dataPromise: Promise<{ date: string; pageViews: number }[]>
}) {
  const pageViewsData = use(dataPromise)

  return (
    <ChartContainer
      config={{
        pageViews: {
          label: "Page Views",
          color: "hsl(var(--chart-1))",
        },
      }}
    >
      <AreaChart data={pageViewsData}>
        <XAxis dataKey="date" />
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
    </ChartContainer>
  )
}
