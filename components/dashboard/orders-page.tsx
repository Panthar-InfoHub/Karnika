"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Plus, Search, Truck } from "lucide-react";
import { AdminOrderType } from "@/types/DbType";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "secondary";
    case "processing":
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

export function OrdersPage({ orders }: { orders: AdminOrderType[] }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // || order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage all customer orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredOrders.map((order) => (
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
                    <Badge variant={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Order Details - {order.id}
                              </DialogTitle>
                              <DialogDescription>
                                Complete order information and status.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Customer</h4>
                                  <p>{order.user.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.user.email}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Status</h4>
                                  <Badge variant={getStatusColor(order.orderStatus)}>
                                    {order.orderStatus}
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Total</h4>
                                  <p>₹{order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Date</h4>
                                  <p>{order.createdAt.toLocaleString()}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                                      <div>
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-gray-600">{item.variantName}</p>
                                        {item.variant?.attributes && typeof item.variant.attributes === 'object' && (
                                          <div className="flex gap-1 mt-1">
                                            {Object.entries(item.variant.attributes as Record<string, string>).map(([key, value]) => (
                                              <span key={key} className="text-xs bg-gray-100 px-1 rounded">
                                                {key}: {value}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <p>Qty: {item.quantity}</p>
                                        <p className="font-medium">₹{item.price .toFixed(2)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Shipping Address</h4>
                                <p className="text-sm">{order.address}</p>
                                <p className="text-sm">Phone: {order.phone}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Update Status
                                </h4>
                                <Select defaultValue={order.orderStatus}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="PROCESSING">
                                      Processing
                                    </SelectItem>
                                    <SelectItem value="SHIPPED">
                                      Shipped
                                    </SelectItem>
                                    <SelectItem value="DELIVERED">
                                      Delivered
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
