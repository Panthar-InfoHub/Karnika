"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus } from "lucide-react";

interface ProductVariant {
  id: string;
  price: number;
  stock: number;
  variantName: string;
  isDefault: boolean;
  attributes: Record<string, string>;
}

interface ProductPurchaseProps {
  product: {
    id: string;
    name: string;
    images: string[];
    variants: ProductVariant[];
  };
}

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const { addItem } = useCart();
  
  // Get default variant or first variant
  const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Get price display logic
  const getPriceDisplay = () => {
    if (product.variants.length <= 1) {
      return `₹${selectedVariant.price.toFixed(2)}`;
    }
    
    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `₹${minPrice.toFixed(2)}`;
    }
    
    return {
      range: `₹${minPrice.toFixed(2)} - ₹${maxPrice.toFixed(2)}`,
      selected: `₹${selectedVariant.price.toFixed(2)}`
    };
  };

  const priceDisplay = getPriceDisplay();

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error("Not enough stock available");
      return;
    }

    setIsLoading(true);
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: selectedVariant.price,
        image: product.images[0],
        variantId: selectedVariant.id,
        variantName: selectedVariant.variantName,
        attributes: selectedVariant.attributes
      });

      toast.success(`Added ${quantity} ${product.name} to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfStock = selectedVariant.stock === 0;
  const maxQuantity = Math.min(selectedVariant.stock, 10); // Limit to 10 or stock amount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Display */}
        <div>
          {typeof priceDisplay === 'string' ? (
            <div className="text-3xl font-bold text-green-600">
              {priceDisplay}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Price Range</div>
              <div className="text-lg text-gray-600">{priceDisplay.range}</div>
              <div className="text-2xl font-bold text-green-600">
                Selected: {priceDisplay.selected}
              </div>
            </div>
          )}
        </div>

        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Variant</label>
            <Select
              value={selectedVariant.id}
              onValueChange={(variantId) => {
                const variant = product.variants.find(v => v.id === variantId);
                if (variant) {
                  setSelectedVariant(variant);
                  setQuantity(1); // Reset quantity when variant changes
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{variant.variantName}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="font-medium">₹{variant.price.toFixed(2)}</span>
                        {variant.stock <= 0 ? (
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        ) : variant.stock < 10 ? (
                          <Badge variant="outline" className="text-xs">Low Stock</Badge>
                        ) : null}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Selected Variant Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{selectedVariant.variantName}</span>
            {selectedVariant.isDefault && (
              <Badge variant="secondary" className="text-xs">Default</Badge>
            )}
          </div>
          
          {/* Variant Attributes */}
          {Object.keys(selectedVariant.attributes).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(selectedVariant.attributes).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Stock Info */}
          <div className="text-sm text-gray-600">
            {isOutOfStock ? (
              <span className="text-red-600 font-medium">Out of Stock</span>
            ) : selectedVariant.stock < 10 ? (
              <span className="text-orange-600">Only {selectedVariant.stock} left in stock</span>
            ) : (
              <span className="text-green-600">In Stock ({selectedVariant.stock} available)</span>
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        {!isOutOfStock && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium min-w-[2rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Total Price */}
        {quantity > 1 && (
          <div className="text-lg font-semibold">
            Total: ₹{((selectedVariant.price * quantity)).toFixed(2)}
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isLoading ? "Adding..." : isOutOfStock ? "Out of Stock" : `Add ${quantity} to Cart`}
        </Button>
      </CardContent>
    </Card>
  );
}
