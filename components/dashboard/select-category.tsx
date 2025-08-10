"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/prisma/generated/prisma";
import CreateCategory from "./create-category";
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
        {/* {showAddButton && (
          <CreateCategory trigger={
            <div className="w-full flex gap-2 items-center justify-center border-t p-1 cursor-pointer hover:bg-muted-foreground/10 hover:text-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </div>
          }/>
        )} */}
      </SelectContent>
    </Select>
  );
}
