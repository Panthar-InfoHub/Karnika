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
import { Category } from "@/prisma/generated/prisma";
import { ProductWithCategory } from "@/types/DbType";
import { SelectCategory } from "./select-category";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteProductAction } from "@/actions/productAction";
import Link from "next/link";
import { toast } from "sonner";

export function ProductsTable({
  products,
  categories,
}: {
  products: ProductWithCategory[];
  categories: Partial<Category>[];
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [deleteProduct, setDeleteProduct] =
    React.useState<ProductWithCategory | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  // Server-side filtering is better, but keeping client-side for simplicity
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === null || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleDeleteProduct = async (product: ProductWithCategory) => {
    setIsDeleting(product.id);

    console.log("Deleting product:", product.id);
    try {
      const resp = await deleteProductAction(product.id);
      if (resp?.error) {
        throw new Error(resp.error);
      }
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(null);
      setDeleteProduct(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <SelectCategory
          categories={categories}
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          placeholder="All Categories"
          showAllOption={true}
        />
      </div>

      {/* product table  */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            Manage your product catalog and inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="flex items-center gap-2">
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover content-center overflow-hidden"
                      />
                      <span className="font-medium">{product.name}</span>
                    </TableCell>
                    <TableCell>
                      {/* Display price range or single price */}
                      {(() => {
                        if (!product.variants || product.variants.length === 0) return "N/A";
                        
                        // If there's a default variant, show its price prominently
                        const defaultVariant = product.variants.find(v => v.isDefault);
                        if (defaultVariant && product.variants.length === 1) {
                          return `₹${defaultVariant.price.toFixed(2)}`;
                        }
                        
                        // Show price range if multiple variants
                        const prices = product.variants.map(v => v.price);
                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);
                        
                        if (minPrice === maxPrice) {
                          return `₹${minPrice.toFixed(2)}`;
                        }
                        
                        return (
                          <div className="flex flex-col">
                            <span>₹{minPrice.toFixed(2)} - ₹{maxPrice.toFixed(2)}</span>
                            <span className="text-xs text-gray-500">
                              {product.variants.length} variants
                            </span>
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.totalStock < 20 ? "destructive" : "secondary"
                        }
                      >
                        {product.totalStock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.category?.name || "Uncategorized"}
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
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteProduct(product)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-4"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`}
        onConfirm={() => deleteProduct && handleDeleteProduct(deleteProduct)}
        confirmText="Delete"
        isLoading={isDeleting === deleteProduct?.id}
      />
    </div>
  );
}
