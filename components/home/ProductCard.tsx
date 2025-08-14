"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    images: string[];
    slug: string;
    variants?: Array<{
      id: string;
      price: number;
      stock: number;
      variantName: string;
      isDefault: boolean;
      attributes: any;
    }>;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  // Get display price and variant info
  const getDisplayPrice = () => {
    if (!product.variants || product.variants.length === 0) return 0;
    
    // If there's a default variant, use it
    const defaultVariant = product.variants.find(v => v.isDefault);
    if (defaultVariant) return defaultVariant.price;
    
    // Otherwise, get the lowest price
    const prices = product.variants.map(v => v.price);
    return Math.min(...prices);
  };

  const getPriceRange = () => {
    if (!product.variants || product.variants.length <= 1) return null;
    
    // Filter out default-only scenarios
    const nonDefaultVariants = product.variants.filter(v => !v.isDefault);
    if (nonDefaultVariants.length === 0) return null; // Only default variant exists
    
    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Only show range if there's a meaningful price difference (more than ₹1)
    if (maxPrice - minPrice < 100) return null; // Less than ₹1 difference
    
    return {
      min: minPrice,
      max: maxPrice
    };
  };

  // Get default variant or first variant for selection
  const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  
  // Check if product has multiple variants
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const displayPrice = getDisplayPrice();
  const priceRange = getPriceRange();

  const handleAddToCart = () => {
    if (!selectedVariant || !product) {
      toast.error("Invalid selection");
      return;
    }

    if (selectedVariant.stock <= 0) {
      toast.error("This variant is out of stock");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      image: product.images?.[0],
      variantId: selectedVariant.id,
      variantName: selectedVariant.variantName,
      attributes: selectedVariant.attributes || {}
    });

    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (!product || !selectedVariant) {
    return null;
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardContent className="px-4">
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-square mb-4 h-32 overflow-hidden rounded-lg mx-auto relative cursor-pointer">
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-farm-navy mb-2 group-hover:text-farm-orange transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <div className="flex flex-col">
            {priceRange ? (
              <>
                <span className="font-bold text-farm-navy">
                  ₹{priceRange.min.toFixed(2)} - ₹{priceRange.max.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">Price range</span>
              </>
            ) : (
              <span className="font-bold text-farm-navy">
                ₹{displayPrice.toFixed(2)}
              </span>
            )}
          </div>
          {selectedVariant && (
            <>
              {selectedVariant.stock > 0 ? (
                <span className="text-xs text-green-600">In Stock</span>
              ) : (
                <span className="text-xs text-red-600">Out of Stock</span>
              )}
            </>
          )}
        </div>

        <div className="flex gap-1">
          {hasMultipleVariants && (
            <div className="flex-1">
              <Select
                value={selectedVariant.id}
                onValueChange={(variantId) => {
                  const variant = product.variants?.find(v => v.id === variantId);
                  if (variant) setSelectedVariant(variant);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants?.filter(v => !v.isDefault).map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.variantName} - ₹{variant.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            className="font-semibold transition-all duration-300 hover:scale-105"
            size="sm"
            onClick={handleAddToCart}
            disabled={selectedVariant.stock <= 0}
          >
            {selectedVariant.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
