"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Label,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download } from 'lucide-react'
import { Button } from "@/components/ui/button"

const salesData = [
  { month: "Jan", sales: 42000, orders: 240 },
  { month: "Feb", sales: 38000, orders: 210 },
  { month: "Mar", sales: 52000, orders: 305 },
  { month: "Apr", sales: 48000, orders: 280 },
  { month: "May", sales: 64000, orders: 392 },
  { month: "Jun", sales: 59000, orders: 350 },
  { month: "Jul", sales: 72000, orders: 430 },
]

const categoryData = [
  { name: "Electronics", value: 42 },
  { name: "Clothing", value: 26 },
  { name: "Accessories", value: 18 },
  { name: "Home", value: 14 },
]

const topProductsData = [
  { name: "Wireless Headphones", units: 1234 },
  { name: "Smart Watch", units: 987 },
  { name: "Laptop Stand", units: 756 },
  { name: "USB-C Cable", units: 654 },
  { name: "Phone Case", units: 543 },
]

const kpiData = [
  { name: "Conversion", value: 3.2, fillKey: "conv" },
  { name: "Retention", value: 78, fillKey: "ret" },
  { name: "CSAT", value: 96, fillKey: "csat" },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Sales + Orders (Area) */}
        <div className="lg:col-span-7 rounded-xl border bg-background p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Sales Overview</h3>
            <div className="mt-1 text-xl font-semibold">Revenue & Orders</div>
          </div>
          <ChartContainer
            className="h-[280px] w-full"
            config={{
              sales: { label: "Revenue", color: "var(--chart-1)" },
              orders: { label: "Orders", color: "var(--chart-2)" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={"var(--chart-1)"} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={"var(--chart-1)"} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={"var(--chart-2)"} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={"var(--chart-2)"} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  name="Revenue"
                  stroke={"var(--color-sales)"}
                  fill="url(#fillSales)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke={"var(--color-orders)"}
                  fill="url(#fillOrders)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Top Products (Horizontal Bars) */}
        <div className="lg:col-span-4 rounded-xl border bg-background p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Top Selling Products</h3>
            <div className="mt-1 text-xl font-semibold">By Units</div>
          </div>
          <ChartContainer
            className="h-[320px] w-full"
            config={{
              units: { label: "Units", color: "var(--chart-1)" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProductsData.slice().reverse()}
                layout="vertical"
                margin={{ top: 8, left: 8, right: 12, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="units" radius={[6, 6, 6, 6]} fill={"var(--color-units)"} maxBarSize={18}>
                  <LabelList
                    dataKey="units"
                    position="right"
                    className="text-xs fill-foreground"
                    formatter={(v: number) => v.toLocaleString()}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* KPIs (Radial Bars) */}
        <div className="lg:col-span-3 rounded-xl border bg-background p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Key Metrics</h3>
            <div className="mt-1 text-xl font-semibold">Store Performance</div>
          </div>
          <ChartContainer
            className="h-[320px] w-full"
            config={{
              conv: { label: "Conversion", color: "var(--chart-2)" },
              ret: { label: "Retention", color: "var(--chart-4)" },
              csat: { label: "CSAT", color: "var(--chart-1)" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="90%"
                data={kpiData.map((d) => ({
                  ...d,
                  // Normalize conversion (0-5%) to 0-100 ring; others already percent.
                  percent: d.name === "Conversion" ? Math.min(100, d.value * 20) : d.value,
                }))}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="percent"
                  background
                  cornerRadius={8}
                  className="stroke-transparent"
                  fillOpacity={0.9}
                >
                  {kpiData.map((entry, idx) => (
                    <Cell key={entry.name} fill={`var(--color-${entry.fillKey})`} />
                  ))}
                </RadialBar>
                <Tooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => {
                        const label = item?.payload?.name
                        const raw =
                          label === "Conversion" ? `${item?.payload?.value}%` : `${item?.payload?.value}%`
                        return [raw, label]
                      }}
                      indicator="dot"
                    />
                  }
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            {kpiData.map((k) => (
              <div key={k.name} className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: `var(--color-${k.fillKey})` }}
                />
                <span className="text-muted-foreground">{k.name}</span>
                <span className="ml-auto font-medium">{k.value}{k.name === "CSAT" ? "%" : k.name === "Retention" ? "%" : "%"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
