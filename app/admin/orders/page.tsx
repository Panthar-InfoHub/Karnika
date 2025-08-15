import { OrdersPage } from "@/components/dashboard/orders-page";
import { prisma } from "@/prisma/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import PageSkeleton from "@/components/dashboard/PageSkeleton";

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



export default function Orders() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <OrdersContent />
    </Suspense>
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
