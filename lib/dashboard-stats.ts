import { prisma } from "@/prisma/db";

export type TimePeriod = 'today' | '30days' | 'lifetime';

export interface DashboardStats {
  revenue: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockCount: number;
  revenueData: Array<{ date: string; revenue: number; orders: number }>;
  orderStatusData: Array<{ status: string; count: number; value: number }>;
  topProducts: Array<{ name: string; revenue: number; quantity: number }>;
}

export async function getDashboardStats(period: TimePeriod = 'today'): Promise<DashboardStats> {
  const { startDate, endDate } = getDateRange(period);

  try {
    // Parallel fetch for better performance
    const [
      revenue,
      pendingOrders,
      totalProducts,
      lowStockCount,
      revenueData,
      orderStatusData,
      topProducts
    ] = await Promise.all([
      getRevenue(startDate, endDate),
      getPendingOrders(),
      getTotalProducts(),
      getLowStockCount(),
      getRevenueData(period),
      getOrderStatusData(startDate, endDate),
      getTopProducts(startDate, endDate)
    ]);

    return {
      revenue,
      pendingOrders,
      totalProducts,
      lowStockCount,
      revenueData,
      orderStatusData,
      topProducts
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}

function getDateRange(period: TimePeriod) {
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'lifetime':
      startDate = new Date(2020, 0, 1); // Assuming business started in 2020
      break;
  }
  
  return { startDate, endDate: now };
}

async function getRevenue(startDate: Date, endDate: Date): Promise<number> {
  const result = await prisma.order.aggregate({
    where: {
      paymentStatus: 'SUCCESS',
      paymentCapturedAt: {
        gte: startDate,
        lte: endDate
      }
    },
    _sum: {
      totalAmount: true
    }
  });
  
  return result._sum.totalAmount || 0;
}

async function getPendingOrders(): Promise<number> {
  return await prisma.order.count({
    where: {
      orderStatus: 'PENDING'
    }
  });
}

async function getTotalProducts(): Promise<number> {
  return await prisma.product.count();
}

async function getLowStockCount(): Promise<number> {
  return await prisma.productVariant.count({
    where: {
      stock: {
        lt: 10
      }
    }
  });
}

async function getRevenueData(period: TimePeriod) {
  const { startDate } = getDateRange(period);
  
  // For today, show hourly data; for others show daily/monthly
  if (period === 'today') {
    return await getTodayHourlyData();
  } else if (period === '30days') {
    return await getDailyData(startDate, 30);
  } else {
    return await getMonthlyData(startDate);
  }
}

async function getTodayHourlyData() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: 'SUCCESS',
      paymentCapturedAt: {
        gte: startOfDay,
        lte: today
      }
    },
    select: {
      totalAmount: true,
      paymentCapturedAt: true
    },
    orderBy: {
      paymentCapturedAt: 'asc'
    }
  });

  // If no orders today, show last 7 days instead
  if (orders.length === 0) {
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fallbackData = await getDailyData(sevenDaysAgo, 7);
    
    // If still no data, return empty array (will show "no data" message)
    return fallbackData.length > 0 ? fallbackData : [];
  }

  // Group by hour (0-23)
  const hourlyData: Record<number, { revenue: number; orders: number }> = {};
  
  // Initialize all hours with 0
  for (let i = 0; i <= 23; i++) {
    hourlyData[i] = { revenue: 0, orders: 0 };
  }

  orders.forEach(order => {
    if (order.paymentCapturedAt) {
      const hour = order.paymentCapturedAt.getHours();
      hourlyData[hour].revenue += order.totalAmount;
      hourlyData[hour].orders += 1;
    }
  });

  return Object.entries(hourlyData).map(([hour, data]) => ({
    date: `${String(hour).padStart(2, '0')}:00`,
    revenue: data.revenue,
    orders: data.orders
  }));
}

async function getDailyData(startDate: Date, days: number) {
  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: 'SUCCESS',
      paymentCapturedAt: {
        gte: startDate
      }
    },
    select: {
      totalAmount: true,
      paymentCapturedAt: true
    },
    orderBy: {
      paymentCapturedAt: 'asc'
    }
  });

  // Group by date
  const grouped = orders.reduce((acc, order) => {
    const date = order.paymentCapturedAt?.toISOString().split('T')[0] || '';
    if (!acc[date]) {
      acc[date] = { revenue: 0, orders: 0 };
    }
    acc[date].revenue += order.totalAmount;
    acc[date].orders += 1;
    return acc;
  }, {} as Record<string, { revenue: number; orders: number }>);

  // Fill in missing dates with 0 values
  const result = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const data = grouped[dateStr] || { revenue: 0, orders: 0 };
    
    result.push({
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      revenue: data.revenue,
      orders: data.orders
    });
  }

  return result;
}

async function getMonthlyData(startDate: Date) {
  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: 'SUCCESS',
      paymentCapturedAt: {
        gte: startDate
      }
    },
    select: {
      totalAmount: true,
      paymentCapturedAt: true
    },
    orderBy: {
      paymentCapturedAt: 'asc'
    }
  });

  // Group by month-year
  const grouped = orders.reduce((acc, order) => {
    if (order.paymentCapturedAt) {
      const year = order.paymentCapturedAt.getFullYear();
      const month = order.paymentCapturedAt.getMonth();
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          revenue: 0, 
          orders: 0, 
          year,
          month,
          date: new Date(year, month, 1)
        };
      }
      acc[monthKey].revenue += order.totalAmount;
      acc[monthKey].orders += 1;
    }
    return acc;
  }, {} as Record<string, { revenue: number; orders: number; year: number; month: number; date: Date }>);

  // If no orders found, return empty array
  if (Object.keys(grouped).length === 0) {
    return [];
  }

  // Sort by date and format for display
  return Object.values(grouped)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(data => ({
      date: data.date.toLocaleDateString('en', { month: 'short', year: 'numeric' }),
      revenue: data.revenue,
      orders: data.orders
    }));
}

async function getOrderStatusData(startDate: Date, endDate: Date) {
  const orders = await prisma.order.groupBy({
    by: ['orderStatus'],
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    _count: {
      id: true
    },
    _sum: {
      totalAmount: true
    }
  });

  return orders.map(order => ({
    status: order.orderStatus,
    count: order._count.id,
    value: order._sum.totalAmount || 0
  }));
}

async function getTopProducts(startDate: Date, endDate: Date) {
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productName'],
    where: {
      order: {
        paymentStatus: 'SUCCESS',
        paymentCapturedAt: {
          gte: startDate,
          lte: endDate
        }
      }
    },
    _sum: {
      quantity: true,
      price: true
    },
    orderBy: {
      _sum: {
        price: 'desc'
      }
    },
    take: 5
  });

  return topProducts.map(product => ({
    name: product.productName,
    revenue: (product._sum.price || 0) * (product._sum.quantity || 0),
    quantity: product._sum.quantity || 0
  }));
}
