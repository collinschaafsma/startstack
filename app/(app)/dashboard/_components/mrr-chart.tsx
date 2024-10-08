"use client"

import { use } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function MRRChart({
  data,
}: {
  data: Promise<{ month: string; mrr: number }[]>
}) {
  const mrrData = use(data)

  return (
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
  )
}
