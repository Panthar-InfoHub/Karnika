"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface VariantSelectorProps {
  product: any; // Will be properly typed after migration
  selectedVariantId?: string;
  onVariantChange: (variantId: string) => void;
}

export function VariantSelector({ product, selectedVariantId, onVariantChange }: VariantSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  // Get all unique attribute names from variants
  const getAttributeNames = () => {
    const attributeNames = new Set<string>();
    product.variants?.forEach((variant: any) => {
      if (!variant.isDefault) {
        Object.keys(variant.attributes || {}).forEach(attr => attributeNames.add(attr));
      }
    });
    return Array.from(attributeNames);
  };

  // Get available values for a specific attribute
  const getAttributeValues = (attributeName: string) => {
    const values = new Set<string>();
    product.variants?.forEach((variant: any) => {
      if (!variant.isDefault && variant.attributes?.[attributeName]) {
        values.add(variant.attributes[attributeName]);
      }
    });
    return Array.from(values);
  };

  // Find variant that matches selected attributes
  const findMatchingVariant = (attributes: Record<string, string>) => {
    return product.variants?.find((variant: any) => {
      if (variant.isDefault) return false;
      
      const variantAttrs = variant.attributes || {};
      return Object.keys(attributes).every(key => 
        variantAttrs[key] === attributes[key]
      ) && Object.keys(variantAttrs).length === Object.keys(attributes).length;
    });
  };

  // Get currently selected variant
  const getCurrentVariant = () => {
    if (selectedVariantId) {
      return product.variants?.find((v: any) => v.id === selectedVariantId);
    }

    if (Object.keys(selectedAttributes).length > 0) {
      return findMatchingVariant(selectedAttributes);
    }

    // Return default variant or first variant
    return product.variants?.find((v: any) => v.isDefault) || product.variants?.[0];
  };

  const currentVariant = getCurrentVariant();
  const attributeNames = getAttributeNames();
  const hasVariants = attributeNames.length > 0;

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    // Find matching variant
    const matchingVariant = findMatchingVariant(newAttributes);
    if (matchingVariant) {
      onVariantChange(matchingVariant.id);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!currentVariant || !product) {
      toast.error("Please select a variant");
      return;
    }

    if (currentVariant.stock <= 0) {
      toast.error("This variant is out of stock");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: currentVariant.price,
      image: product.images?.[0],
      variantId: currentVariant.id,
      variantName: currentVariant.variantName,
    //   quantity: 1,
    
      attributes: currentVariant.attributes || {}
    });

    toast.success("Added to cart", {
      description: `${product.name} (${currentVariant.variantName}) has been added to your cart.`,
    });
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Product Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {product.images?.[0] && (
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image: string, index: number) => (
                    <div key={index} className="aspect-square rounded border overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.category && (
                  <Badge variant="secondary" className="mt-2">
                    {product.category.name}
                  </Badge>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground">{product.description}</p>
              )}

              {/* Variant Selection */}
              {hasVariants && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Select Options</h3>
                  {attributeNames.map(attributeName => (
                    <div key={attributeName} className="space-y-2">
                      <label className="text-sm font-medium capitalize">
                        {attributeName}
                      </label>
                      <Select
                        value={selectedAttributes[attributeName] || ""}
                        onValueChange={(value) => handleAttributeChange(attributeName, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${attributeName}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getAttributeValues(attributeName).map(value => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}

              {/* Price and Stock */}
              {currentVariant && (
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    ₹{currentVariant.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentVariant.stock > 0 ? (
                      `${currentVariant.stock} in stock`
                    ) : (
                      <span className="text-red-500">Out of stock</span>
                    )}
                  </div>
                  
                  {hasVariants && currentVariant && !currentVariant.isDefault && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-sm text-muted-foreground">Selected:</span>
                      <Badge variant="outline">
                        {currentVariant.variantName}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart */}
              <Button 
                onClick={handleAddToCart}
                disabled={!currentVariant || currentVariant.stock <= 0}
                className="w-full"
                size="lg"
              >
                {!currentVariant ? "Select variant" : 
                 currentVariant.stock <= 0 ? "Out of stock" : 
                 "Add to Cart"}
              </Button>

              {/* Additional Info */}
              {hasVariants && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Select all options to see price and availability</p>
                  <p>• Different combinations may have different prices</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
