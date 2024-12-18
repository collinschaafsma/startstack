"use client"

import { use } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function MRRChart({
  dataPromise,
}: {
  dataPromise: Promise<{ month: string; mrr: number }[]>
}) {
  const mrrData = use(dataPromise)

  return (
    <ChartContainer
      config={{
        mrr: {
          label: "MRR",
          color: "hsl(var(--chart-1))",
        },
      }}
    >
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
    </ChartContainer>
  )
}
