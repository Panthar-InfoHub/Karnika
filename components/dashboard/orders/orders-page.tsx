import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminOrderType } from "@/types/DbType";
import { OrderRowActions } from "./order-row-actions";
import { OrdersFilter } from "./orders-filter";
import { OrdersPagination } from "./orders-pagination";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "secondary";
    case "confirmed":
      return "default";
    case "packed":
      return "default";
    case "shipped":
      return "default";
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

// Order Status Badge Component
function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={getStatusColor(status)}>
      {status}
    </Badge>
  );
}

// Orders Table Component - Server Component
function OrdersTable({ orders }: { orders: AdminOrderType[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Phone No.</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.user.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>{order.phone}</TableCell>
              <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.orderStatus} />
              </TableCell>
              <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <OrderRowActions order={order} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No orders found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

// Main Orders Page Component - Server Component
export function OrdersPage({ 
  orders, 
  pagination 
}: { 
  orders: AdminOrderType[];
  pagination: PaginationInfo;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <OrdersFilter />

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage all customer orders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <OrdersTable orders={orders} />
          <OrdersPagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
