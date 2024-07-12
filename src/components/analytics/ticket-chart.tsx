"use client"

import { api } from "@/trpc/react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

const chartConfig = {
  sold: {
    label: "Sold",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig
export function TicketChart() {
  const ticketChartCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  const { data } = api.ticket.getTicketSaleDate.useQuery()

  data?.map((dataVal) => {
    const month = dataVal.createdAt.getMonth()
    if (month) {
      ticketChartCount[month] = ticketChartCount[month] + 1
    }

    return console.log(month)
  })
  console.log(ticketChartCount)

  const chartData = [
    { month: "January", sold: ticketChartCount[0] },
    { month: "Feb", sold: ticketChartCount[1] },
    { month: "Mar", sold: ticketChartCount[2] },
    { month: "Apr", sold: ticketChartCount[3] },
    { month: "May", sold: ticketChartCount[4] },
    { month: "Jun", sold: ticketChartCount[5] },
    { month: "Jul", sold: ticketChartCount[6] },
    { month: "Aug", sold: ticketChartCount[7] },
    { month: "Sept", sold: ticketChartCount[8] },
    { month: "Oct", sold: ticketChartCount[9] },
    { month: "Nov", sold: ticketChartCount[10] },
    { month: "Dec", sold: ticketChartCount[11] },
  ]

  return (
    <Card className="max-w-[500px]">
      <CardHeader>
        <CardTitle>Ticket Sales Chart</CardTitle>
        <CardDescription>Showing total sales for this year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Area
              dataKey="sold"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
