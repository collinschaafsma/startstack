"use client"

import { use } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function PageViewChart({
  data,
}: {
  data: Promise<{ date: string; pageViews: number }[]>
}) {
  const pageViewsData = use(data)

  return (
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
      </ResponsiveContainer>
    </ChartContainer>
  )
}
