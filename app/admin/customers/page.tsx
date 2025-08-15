import CustomerTable from "@/components/dashboard/CustomerTable";
import PageSkeleton from "@/components/dashboard/PageSkeleton";
import ErrorCard from "@/components/ErrorCard";
import { prisma } from "@/prisma/db";
import { Customer } from "@/types/DbType";
import { Suspense } from "react";

export default async function Customers() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CustomersContent />
    </Suspense>
  );
}

const CustomersContent = async () => {

  async function getCustomers(): Promise<Customer[]> {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            orders: true
          }
        },
        orders: {
          select: {
            totalAmount: true,
          }
        }
      },
    });
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user?.image || undefined,
      totalOrders: user._count.orders || 0,
      createdAt: user.createdAt || undefined,
      totalSpent: user.orders.reduce((total, order) => total + (order.totalAmount || 0), 0),
    }));
  }

  let customers: Customer[] = [];
  try {
    customers = await getCustomers();
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        </div>
        <CustomerTable customers={customers} />
      </div>
    );
  } catch (error) {
    return <ErrorCard error={error as Error} title="Customers" />;
  }
};
