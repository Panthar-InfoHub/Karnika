"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Eye } from "lucide-react";
import { AdminOrderType } from "@/types/DbType";

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

function OrderStatusBadge({ status }: { status: string }) {
    return (
        <Badge variant={getStatusColor(status)}>
            {status}
        </Badge>
    );
}

export function OrderDetailsDialog({ order }: { order: AdminOrderType }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        setIsOpen(true);
                    }}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="!max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Order Details - #{order.id}</DialogTitle>
                    <DialogDescription>
                        Complete order information.
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
                            <OrderStatusBadge status={order.orderStatus} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold">Total</h4>
                            <p>₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Date & Time</h4>
                            <p>
                                {order.createdAt.toLocaleDateString()} -{" "}
                                {order.createdAt.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Order Items</h4>
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center p-2 border rounded"
                                >
                                    <div>
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-gray-600">{item.variantName}</p>
                                        {item.variant?.attributes &&
                                            typeof item.variant.attributes === "object" && (
                                                <div className="flex gap-1 mt-1">
                                                    {Object.entries(
                                                        item.variant.attributes as Record<string, string>
                                                    ).map(([key, value]) => (
                                                        <span
                                                            key={key}
                                                            className="text-xs bg-gray-100 px-1 rounded"
                                                        >
                                                            {key}: {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                    <div className="text-right">
                                        <p>Qty: {item.quantity}</p>
                                        <p className="font-medium">₹{item.price.toFixed(2)}</p>
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
