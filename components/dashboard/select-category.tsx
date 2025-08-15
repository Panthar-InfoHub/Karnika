"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/prisma/generated/prisma";
import CreateCategory from "./category-create";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface SelectCategoryProps {
  categories: Partial<Category>[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  showAllOption?: boolean;
  showAddButton?: boolean;
}

export function SelectCategory({
  categories,
  value,
  onValueChange,
  placeholder = "Select category",
  showAllOption = false,
  showAddButton = false,
}: SelectCategoryProps) {
  return (
    <Select 
      value={value || ""} 
      onValueChange={(selectedValue) => {
        if (selectedValue === "all") {
          onValueChange(null);
        } else {
          onValueChange(selectedValue);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder}  />
      </SelectTrigger>
      <SelectContent>
        {showAllOption ? (
          <SelectItem value="all">All Categories</SelectItem>
        ) : null}
        {categories.length > 0 ? (
          categories.map((category) => {
            if (!category.id) return null;
            return (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            );
          })
        ) : (
          <div className="text-xs p-2 font-semibold text-muted-foreground">
            No Categories Found
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
