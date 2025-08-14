import { OrdersPage } from "@/components/dashboard/orders-page";
import { prisma } from "@/prisma/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOrderType } from "@/types/DbType";

async function getOrdersData() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              }
            },
            variant: {
              select: {
                variantName: true,
                attributes: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { orders };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw new Error('Failed to load orders');
  }
}

export function OrdersLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersError({ error }: { error: Error }) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription className="text-destructive">
            Failed to load orders: {error.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function OrdersContent() {
  try {
    const { orders } = await getOrdersData();
    return <OrdersPage orders={orders} />;
  } catch (error) {
    return <OrdersError error={error as Error} />;
  }
}

export default function Orders() {
  return (
    <Suspense fallback={<OrdersLoading />}>
      <OrdersContent />
    </Suspense>
  );
}
