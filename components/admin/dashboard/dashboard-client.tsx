"use client";

import { useState } from "react";
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { RevenueAreaChart } from "@/components/admin/dashboard/revenue-area-chart-new";
import { CategoryPerformance } from "@/components/admin/dashboard/category-performance";
import { OrdersComparison } from "@/components/admin/dashboard/orders-comparison";
import { TopProductsList } from "@/components/admin/dashboard/top-products-list";
import { RecentOrdersList } from "@/components/admin/dashboard/recent-orders-list";
import { OrderStatusChart } from "@/components/admin/dashboard/order-status-chart";
import {
  TimeFilter,
  type TimeFilter as TimeFilterType,
} from "@/components/admin/dashboard/time-filter";

interface DashboardClientProps {
  initialStats: any;
  initialRevenue: any[];
  initialCategories: any[];
  initialTopProducts: any[];
}

export function DashboardClient({
  initialStats,
  initialRevenue,
  initialCategories,
  initialTopProducts,
}: DashboardClientProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("today");
  const [isLoading, setIsLoading] = useState(false);

  // For now, use initial data - full implementation would refetch on filter change
  const stats = initialStats;
  const revenueData = initialRevenue;
  const categoryData = initialCategories;
  const topProducts = initialTopProducts;

  // Create modified stats for "today" view - show today's data as main values
  const displayStats =
    timeFilter === "today" && stats
      ? {
          ...stats,
          totalRevenue: stats.todayRevenue,
          totalOrders: stats.todayOrders,
          // Keep growth percentages as they are
        }
      : stats;

  return (
    <div className="space-y-6">
      {/* Header with Time Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Your store performance at a glance</p>
        </div>
        <TimeFilter value={timeFilter} onValueChange={setTimeFilter} />
      </div>

      {/* Stats - Minimal Cards with Today's Data */}
      {displayStats && <DashboardStats stats={displayStats} timeFilter={timeFilter} />}

      {/* Main Revenue & Orders Area Chart - Rectangular & Colorful */}
      <RevenueAreaChart data={revenueData} />

      {/* Two Column Grid for Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Performance Radar */}
        <CategoryPerformance data={categoryData} />

        {/* Monthly Orders Bar Chart */}
        <OrdersComparison data={revenueData} />
      </div>
      {/* Order Status Distribution */}
      <OrderStatusChart />

      {/* Recent Orders Full Width */}
      <RecentOrdersList />
    </div>
  );
}
