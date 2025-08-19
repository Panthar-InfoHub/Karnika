import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AdminOrderType } from "@/types/DbType";
import { OrderDetailsDialog } from "./order-details-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";

export function OrderRowActions({ order }: { order: AdminOrderType }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <OrderDetailsDialog order={order} />
                <UpdateStatusDialog order={order} />
                <DropdownMenuSeparator />
                <DropdownMenuItem>Print Invoice</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
