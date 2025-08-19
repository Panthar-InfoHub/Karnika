"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, SortAsc, SortDesc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export function OrdersFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = React.useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = React.useState(searchParams.get("status") || "all");
    const [sortBy, setSortBy] = React.useState(searchParams.get("sortBy") || "createdAt");
    const [sortOrder, setSortOrder] = React.useState(searchParams.get("sortOrder") || "desc");
    const [isSearching, setIsSearching] = React.useState(false);

    // Debounce the search term with 500ms delay
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const updateFilters = React.useCallback((search: string, status: string, sort: string, order: string) => {
        const params = new URLSearchParams(searchParams);
        
        // Reset page to 1 when filters change
        params.delete("page");
        
        if (search.trim()) {
            params.set("search", search.trim());
        } else {
            params.delete("search");
        }
        
        if (status && status !== "all") {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        
        if (sort && sort !== "createdAt") {
            params.set("sortBy", sort);
        } else {
            params.delete("sortBy");
        }
        
        if (order && order !== "desc") {
            params.set("sortOrder", order);
        } else {
            params.delete("sortOrder");
        }

        const queryString = params.toString();
        const url = queryString ? `/admin/orders?${queryString}` : '/admin/orders';
        router.push(url);
        setIsSearching(false);
    }, [router, searchParams]);

    // Effect to trigger search when debounced search term changes
    React.useEffect(() => {
        // Only update if the debounced search term is different from URL params
        const currentSearch = searchParams.get("search") || "";
        if (debouncedSearchTerm !== currentSearch) {
            updateFilters(debouncedSearchTerm, statusFilter, sortBy, sortOrder);
        }
    }, [debouncedSearchTerm, statusFilter, sortBy, sortOrder, updateFilters, searchParams]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        // Show loading indicator when user is typing
        if (value !== debouncedSearchTerm) {
            setIsSearching(true);
        }
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setIsSearching(true);
        // Status change should be immediate (no debouncing needed)
        updateFilters(searchTerm, value, sortBy, sortOrder);
    };

    const handleSortByChange = (value: string) => {
        setSortBy(value);
        updateFilters(searchTerm, statusFilter, value, sortOrder);
    };

    const handleSortOrderChange = (value: string) => {
        setSortOrder(value);
        updateFilters(searchTerm, statusFilter, sortBy, value);
    };

    const getSortByLabel = (value: string) => {
        switch (value) {
            case "createdAt": return "Date";
            case "totalAmount": return "Amount";
            case "orderStatus": return "Status";
            case "user.name": return "Customer";
            default: return "Date";
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
                {isSearching ? (
                    <Loader2 className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
                ) : (
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                )}
                <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-8"
                />
            </div>
            
            <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="PACKED">Packed</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={handleSortByChange}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">📅 Date</SelectItem>
                        <SelectItem value="totalAmount">💰 Amount</SelectItem>
                        <SelectItem value="orderStatus">📦 Status</SelectItem>
                        <SelectItem value="user.name">👤 Customer</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">
                            <div className="flex items-center gap-2">
                                <SortDesc className="h-4 w-4" />
                                <span>Desc</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="asc">
                            <div className="flex items-center gap-2">
                                <SortAsc className="h-4 w-4" />
                                <span>Asc</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
