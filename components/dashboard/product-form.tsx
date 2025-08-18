"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Category } from "@/prisma/generated/prisma";
import { ProductWithCategory } from "@/types/DbType";
import { SelectCategory } from "./select-category";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/productAction";
import { useRouter } from "next/navigation";
import ChooseMedia from "./ChooseMedia";
import { VariantManager } from "./variant-manager";

interface ProductFormProps {
  product?: ProductWithCategory;
  categories: Partial<Category>[];
  mode: "create" | "edit";
}

export function ProductForm({
  product,
  categories,
  mode,
}: ProductFormProps) {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = React.useState<string[]>(
    product?.images || []
  );
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    product?.categoryId || null
  );
  const [variants, setVariants] = React.useState<any[]>(
    product?.variants || []
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // const [isMediaDialogOpen, setIsMediaDialogOpen] = React.useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        formData.append("categoryId", selectedCategory);
      }
      selectedImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      // Add variant data
      formData.append("variants", JSON.stringify(variants));

      if (mode === "create") {
        await createProductAction(formData);
      } else if (product) {
        formData.append("productId", product.id);
        await updateProductAction(formData);
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setSelectedImages([]);
      setSelectedCategory(null);
      setIsSubmitting(false);
    }
  };

  // const handleImageSelect = (imageUrls: string[]) => {
  //   setSelectedImages((prev) => [...prev, ...imageUrls]);
  //   setIsMediaDialogOpen(false);
  // };

  const handleImageRemove = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={product?.name}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product?.description || ""}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <SelectCategory
                categories={categories}
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="Select category"
                showAddButton
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>Set pricing and manage inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price (will be used for variants)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={(() => {
                  const defaultVariant = product?.variants?.find(v => v.isDefault) || product?.variants?.[0];
                  return defaultVariant ? defaultVariant.price.toFixed(2) : "";
                })()}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Base Stock (will be used for variants)</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={(() => {
                  const defaultVariant = product?.variants?.find(v => v.isDefault) || product?.variants?.[0];
                  return defaultVariant?.stock || 0;
                })()}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variant Management */}
      <VariantManager
        onVariantsChange={setVariants}
        initialVariants={(product?.variants || []).map(variant => ({
          id: variant.id,
          attributes: typeof variant.attributes === 'object' && variant.attributes
            ? variant.attributes as Record<string, string>
            : {},
          variantName: variant.variantName,
          price: variant.price,
          stock: variant.stock,
          isDefault: variant.isDefault
        }))}
        basePrice={(() => {
          const defaultVariant = product?.variants?.find(v => v.isDefault) || product?.variants?.[0];
          return defaultVariant?.price || 0;
        })()}
        baseStock={(() => {
          const defaultVariant = product?.variants?.find(v => v.isDefault) || product?.variants?.[0];
          return defaultVariant?.stock || product?.totalStock || 0;
        })()}
      />

      {/* Media Section */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>Add images to showcase your product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Images Display */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleImageRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <Badge className="absolute bottom-1 left-1 text-xs">
                      Primary
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Image Upload Options */}
          <ChooseMedia
            selectedUrls={selectedImages}
            setSelectedUrls={setSelectedImages}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
              ? "Create Product"
              : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
