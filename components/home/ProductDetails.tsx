"use client";

import { useState, useCallback } from "react";
import { ProductPurchaseSection } from "./ProductPurchaseSection";

interface ProductVariant {
    id: string;
    price: number;
    stock: number;
    variantName: string;
    isDefault: boolean;
    attributes: Record<string, string>;
}

interface ProductDetailsProps {
    product: {
        id: string;
        name: string;
        description: string | null;
        images: string[];
        variants: ProductVariant[];
    };
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);

    // Callback to update the main price when variant changes
    const handleVariantChange = useCallback((variant: ProductVariant) => {
        setSelectedVariant(variant);
    }, []);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="text-sm text-gray-500 mb-4">
                    SKU: {product.id.slice(0, 8).toUpperCase()}
                </div>

                {/* Star Rating */}
                <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-lg">⭐</span>
                        ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">45 reviews</span>
                </div>

                {/* Dynamic Price - Updates with variant selection */}
                <div className="mb-6">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                        ₹ {selectedVariant.price}
                    </div>
                    <p className="text-sm text-gray-600">*Inclusive of all taxes</p>
                    
                </div>
            </div>

            {/* Product Description */}
            {product.description && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">PRODUCT DESCRIPTION</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
            )}

            {/* Purchase Section */}
            <ProductPurchaseSection 
                product={product} 
                onVariantChange={handleVariantChange}
            />
        </div>
    );
}
