import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { User } from "lucide-react";
import { prisma } from "@/prisma/db";
import CustomerSearch from "./customer-search";

export interface Customer {
  id: string;
  name: string;
  email: string;
  image?: string;
  totalOrders?: number;
  createdAt?: Date;
  totalSpent?: number;
}

async function getCustomers(): Promise<Customer[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: {
        createdAt: "desc",
      },
      include:{
        _count:{
          select:{
            orders:true

          }

        },
        orders:{
          select:{
            totalAmount:true,
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
      totalSpent:user.orders.reduce((total, order) => total + (order.totalAmount || 0), 0),
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function CustomersPage() {
  const customers = await getCustomers();

  const totalCustomers = customers.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button>Export Customers</Button>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>
      </div> */}

      <CustomerSearch customers={customers} />
    </div>
  );
}
