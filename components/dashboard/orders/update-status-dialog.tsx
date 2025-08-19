"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Truck } from "lucide-react";
import { AdminOrderType } from "@/types/DbType";
import { updateOrderStatus } from "@/actions/orderActions";
import { toast } from "sonner";

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

export function UpdateStatusDialog({ order }: { order: AdminOrderType }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = React.useState<"PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED">(order.orderStatus as any);
    const [isUpdating, setIsUpdating] = React.useState(false);

    const handleStatusUpdate = async () => {
        if (selectedStatus === order.orderStatus) {
            toast.error("Status is already " + selectedStatus);
            return;
        }

        setIsUpdating(true);
        try {
            const result = await updateOrderStatus(order.id, selectedStatus);
            if (result.success) {
                toast.success("Order status updated successfully");

            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(false);
            setIsOpen(false);
        }
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value as "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        setIsOpen(true);
                    }}
                >
                    <Truck className="mr-2 h-4 w-4" />
                    Update Status
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogDescription>
                        Update the status for order #{order.id}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-8 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2">Current Status</h4>
                            <OrderStatusBadge status={order.orderStatus} />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">New Status</h4>
                            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                    <SelectItem value="PACKED">Packed</SelectItem>
                                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>


                    <Button
                        onClick={handleStatusUpdate}
                        disabled={isUpdating || selectedStatus === order.orderStatus}
                        className="w-fit mx-auto "
                    >
                        {isUpdating ? "Updating..." : "Update Status"}
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}
