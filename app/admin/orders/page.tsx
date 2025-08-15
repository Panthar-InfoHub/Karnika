import { OrdersPage } from "@/components/dashboard/orders-page";
import { prisma } from "@/prisma/db";
import { Suspense } from "react";
import PageSkeleton from "@/components/dashboard/PageSkeleton";
import ErrorCard from "@/components/ErrorCard";

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
    return <ErrorCard error={error as Error} title="Orders" />;
  }
}
