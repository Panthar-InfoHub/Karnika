"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+180.1% from last month",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "12,234",
    change: "+19% from last month",
    icon: Package,
  },
  {
    title: "Active Customers",
    value: "573",
    change: "+201 since last hour",
    icon: TrendingUp,
  },
]

const topProducts = [
  {
    name: "Wireless Headphones",
    sales: 1234,
    revenue: "$24,680",
    image: "/test.webp",
  },
  {
    name: "Smart Watch",
    sales: 987,
    revenue: "$19,740",
    image: "/test.webp",
  },
  {
    name: "Laptop Stand",
    sales: 756,
    revenue: "$15,120",
    image: "/test.webp",
  },
  {
    name: "USB-C Cable",
    sales: 654,
    revenue: "$6,540",
    image: "/test.webp",
  },
  {
    name: "Phone Case",
    sales: 543,
    revenue: "$5,430",
    image: "/test.webp",
  },
]

const lowStockItems = [
  { name: "Wireless Mouse", stock: 5, threshold: 10 },
  { name: "Keyboard", stock: 3, threshold: 15 },
  { name: "Monitor", stock: 2, threshold: 8 },
  { name: "Webcam", stock: 1, threshold: 5 },
]

export function DashboardOverview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="flex items-center gap-2">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell className="font-medium">{product.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Products running low on inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <Badge variant="destructive">{item.stock} left</Badge>
                </div>
                <Progress value={(item.stock / item.threshold) * 100} className="h-2" />
              </div>
            ))}
            <Button className="w-full bg-transparent" variant="outline">
              View All Inventory
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Customer {i} • 2 items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(Math.random() * 200 + 50).toFixed(2)}</p>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Performance</CardTitle>
            <CardDescription>Key metrics for your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Conversion Rate</span>
                <span className="text-sm font-medium">3.2%</span>
              </div>
              <Progress value={32} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Average Order Value</span>
                <span className="text-sm font-medium">$127.50</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium">4.8/5</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
