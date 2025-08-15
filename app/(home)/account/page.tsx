import { OrdersPage } from "@/components/dashboard/orders-page";
import PageSkeleton from "@/components/dashboard/PageSkeleton";
import SignOut from "@/components/sign-out";
import { prisma } from "@/prisma/db";
import { getSession } from "@/utils/auth-utils";
import React, { Suspense } from "react";

async function AccountPage() {

  const { orders } = await getOrdersData();

  return (
    <div className="w-full flex-col gap-3 h-full flex justify-center items-center ">
      <h1>Only for the Customers</h1>
      <SignOut className="max-w-xs mx-auto" />
      <OrdersPage orders={orders} />

    </div>
  );
};


export default function Orders() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AccountPage />
    </Suspense>
  );
}


async function getOrdersData() {

  const session = await getSession();

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session?.user.id
      },
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


