"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export function PageSizeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPageSize = searchParams.get("limit") || "10";

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page"); // Reset to first page when changing page size
    
    if (value === "10") {
      params.delete("limit");
    } else {
      params.set("limit", value);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/admin/orders?${queryString}` : '/admin/orders';
    router.push(url);
  };

  return (
    <div className="flex items-center space-x-2 shrink-0">
      <span className="text-sm text-muted-foreground">Show</span>
      <Select value={currentPageSize} onValueChange={handlePageSizeChange}>
        <SelectTrigger className="w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">per page</span>
    </div>
  );
}
