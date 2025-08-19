"use client";

import * as React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { PageSizeSelector } from "./page-size-selector";

interface OrdersPaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}

export function OrdersPagination({
    currentPage,
    totalPages,
    totalCount,
    pageSize
}: OrdersPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const navigateToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        if (page === 1) {
            params.delete("page");
        } else {
            params.set("page", page.toString());
        }

        const queryString = params.toString();
        const url = queryString ? `/admin/orders?${queryString}` : '/admin/orders';
        router.push(url);
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1 && totalCount <= 10) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-4 shrink-0">
                <div className="text-sm text-muted-foreground">
                    Showing {startItem} to {endItem} of {totalCount} orders
                </div>
            </div>

            {totalPages > 1 && (
                <Pagination className="">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => currentPage > 1 && navigateToPage(currentPage - 1)}
                                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {getVisiblePages().map((page, index) => (
                            <PaginationItem key={index}>
                                {page === '...' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() => navigateToPage(page as number)}
                                        isActive={currentPage === page}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => currentPage < totalPages && navigateToPage(currentPage + 1)}
                                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
            <PageSizeSelector />
        </div>
    );
}
