"use client"

import { useState, useEffect, Suspense } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {  TrendingUp, ShoppingCart, Package, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TimePeriod = 'today' | '30days' | 'lifetime';

interface DashboardStats {
  revenue: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockCount: number;
  revenueData: Array<{ date: string; revenue: number; orders: number }>;
  orderStatusData: Array<{ status: string; count: number; value: number }>;
  topProducts: Array<{ name: string; revenue: number; quantity: number }>;
}

const COLORS = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6", 
  PACKED: "#8b5cf6",
  SHIPPED: "#06b6d4",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444"
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  loading = false 
}: { 
  title: string
  value: string | number
  icon: any
  trend?: string
  loading?: boolean 
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        )}
      </CardContent>
    </Card>
  )
}

function ChartSkeleton({ height = "280px" }: { height?: string }) {
  return (
    <div className={`w-full bg-muted animate-pulse rounded-lg`} style={{ height }} />
  )
}

function RevenueChart({ data, loading, period }: { data: any[], loading: boolean, period: TimePeriod }) {
  if (loading) return <ChartSkeleton />
  
  const getChartTitle = () => {
    switch (period) {
      case 'today':
        return data.length > 0 && data[0].date.includes(':') 
          ? 'Today\'s Hourly Breakdown' 
          : 'Last 7 Days (No data today)';
      case '30days':
        return 'Last 30 Days Trend';
      case 'lifetime':
        return 'Monthly Revenue Trend';
      default:
        return 'Revenue Trend';
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Revenue Overview</h3>
        <div className="mt-1 text-xl font-semibold">{getChartTitle()}</div>
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground mt-1">No data available for this period</p>
        )}
      </div>
      
      {data.length > 0 ? (
        <ChartContainer
          className="w-full h-[220px]"
          config={{
            revenue: { label: "Revenue", color: "var(--chart-1)" },
            orders: { label: "Orders", color: "var(--chart-2)" },
          }}
        >
          <AreaChart width={600} height={200} data={data} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={"var(--chart-1)"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={"var(--chart-1)"} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={"var(--chart-2)"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={"var(--chart-2)"} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false}
              fontSize={12}
              interval={period === 'today' ? 2 : 'preserveStart'} // Show every 3rd hour for today
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis yAxisId="right" orientation="right"  tickLine={false} axisLine={false} />
            <ChartTooltip 
              content={<ChartTooltipContent indicator="line" />}
              labelFormatter={(value) => {
                if (period === 'today' && value.includes(':')) {
                  return `Time: ${value}`;
                }
                return `Date: ${value}`;
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={"var(--color-revenue)"}
              fill="url(#fillRevenue)"
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
        </ChartContainer>
      ) : (
        <div className="w-full flex items-center justify-center border rounded-lg bg-muted/20" style={{ height: '200px' }}>
          <div className="text-center">
            <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No revenue data available</p>
            <p className="text-xs text-muted-foreground mt-1">
              {period === 'today' ? 'No orders placed today yet' : 'No orders in this period'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function OrderStatusChart({ data, loading }: { data: any[], loading: boolean }) {
  if (loading) return <ChartSkeleton height="320px" />
  
  if (data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center border rounded-lg bg-muted/20" style={{ height: '280px' }}>
        <div className="text-center">
          <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No orders yet</p>
          <p className="text-xs text-muted-foreground mt-1">Order status will appear here</p>
        </div>
      </div>
    );
  }
  
  return (
    <ChartContainer
      className="w-full"
      config={{
        count: { label: "Orders", color: "var(--chart-1)" },
      }}
    >
      <PieChart width={280} height={280}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={70}
          dataKey="count"
          nameKey="status"
          label={({ status, count, percent }) => 
            count > 0 ? `${status}: ${count}` : ''
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || "#8884d8"} />
          ))}
        </Pie>
        <ChartTooltip 
          content={<ChartTooltipContent />}
          formatter={(value, name) => [value, `${name} Orders`]}
        />
      </PieChart>
    </ChartContainer>
  )
}

function TopProductsChart({ data, loading }: { data: any[], loading: boolean }) {
  if (loading) return <ChartSkeleton height="320px" />
  
  if (data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center border rounded-lg bg-muted/20" style={{ height: '280px' }}>
        <div className="text-center">
          <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No product sales data</p>
          <p className="text-xs text-muted-foreground mt-1">Start selling to see top products</p>
        </div>
      </div>
    );
  }
  
  return (
    <ChartContainer
      className="w-full"
      config={{
        revenue: { label: "Revenue", color: "var(--chart-1)" },
      }}
    >
      <BarChart
        width={400}
        height={280}
        data={data.slice().reverse()}
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
        <ChartTooltip 
          content={<ChartTooltipContent indicator="dot" />}
          formatter={(value, name) => [
            `₹${value.toLocaleString()}`,
            name === 'revenue' ? 'Revenue' : name
          ]}
        />
        <Bar dataKey="revenue" radius={[6, 6, 6, 6]} fill={"var(--color-revenue)"} maxBarSize={18}>
          <LabelList
            dataKey="revenue"
            position="right"
            className="text-xs fill-foreground"
            formatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export function DashboardOverview() {
  const [period, setPeriod] = useState<TimePeriod>('today')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/dashboard/stats?period=${period}`)
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [period])

  const formatValue = (value: number, type: 'currency' | 'number') => {
    if (type === 'currency') {
      return `₹${value.toLocaleString()}`
    }
    return value.toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant={period === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('today')}
            >
              Today
            </Button>
            <Button
              variant={period === '30days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('30days')}
            >
              Last 30 Days
            </Button>
            <Button
              variant={period === 'lifetime' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('lifetime')}
            >
              Lifetime
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue"
          value={stats ? formatValue(stats.revenue, 'currency') : '0'}
          icon={TrendingUp}
          trend={`${period === 'today' ? 'Today' : period === '30days' ? 'Last 30 days' : 'All time'}`}
          loading={loading}
        />
        <StatCard
          title="Pending Orders"
          value={stats ? stats.pendingOrders : '0'}
          icon={ShoppingCart}
          trend="Requires attention"
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={stats ? stats.totalProducts : '0'}
          icon={Package}
          trend="Active products"
          loading={loading}
        />
        <StatCard
          title="Low Stock Alert"
          value={stats ? stats.lowStockCount : '0'}
          icon={AlertTriangle}
          trend="< 10 items remaining"
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <div className="lg:col-span-7 rounded-xl border bg-background p-4">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart data={stats?.revenueData || []} loading={loading} period={period} />
          </Suspense>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-4 rounded-xl border bg-background p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Top Selling Products</h3>
            <div className="mt-1 text-xl font-semibold">By Revenue</div>
          </div>
          <Suspense fallback={<ChartSkeleton height="320px" />}>
            <TopProductsChart data={stats?.topProducts || []} loading={loading} />
          </Suspense>
        </div>

        {/* Order Status */}
        <div className="lg:col-span-3 rounded-xl border bg-background p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Order Status</h3>
            <div className="mt-1 text-xl font-semibold">Distribution</div>
          </div>
          <Suspense fallback={<ChartSkeleton height="320px" />}>
            <OrderStatusChart data={stats?.orderStatusData || []} loading={loading} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
