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
import { Input } from "@/components/ui/input";
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
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import CreateCategory from "./create-category";
import { deleteCategoryAction } from "@/actions/categoryActions";

interface CategoryWithCount {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  slug: string;
  _count: {
    products: number;
  };
}

interface CategoriesTableProps {
  categories: CategoryWithCount[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteCategory, setDeleteCategory] =
    React.useState<CategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const filteredCategories = React.useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleDeleteCategory = async (category: CategoryWithCount) => {
    setIsDeleting(category.id);
    try {
      console.log("Deleting category:", category.id);
      await deleteCategoryAction(category.id);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsDeleting(null);
      setDeleteCategory(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <CreateCategory />
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            View and manage all product categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate">
                        {category.description || "No description available."}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {category._count.products}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteCategory(category)}
                            disabled={isDeleting === category.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting === category.id
                              ? "Deleting..."
                              : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-4"
                  >
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteCategory}
        onOpenChange={() => setDeleteCategory(null)}
        title="Delete Category"
        description={
          deleteCategory?._count.products
            ? `Cannot delete "${deleteCategory?.name}" because it contains ${deleteCategory?._count.products} products. Please move or delete the products first.`
            : `Are you sure you want to delete "${deleteCategory?.name}"? This action cannot be undone.`
        }
        onConfirm={() => deleteCategory && handleDeleteCategory(deleteCategory)}
        confirmText="Delete"
        isLoading={isDeleting === deleteCategory?.id}
        variant={deleteCategory?._count.products ? "default" : "destructive"}
      />
    </div>
  );
}
