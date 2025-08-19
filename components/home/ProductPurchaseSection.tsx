"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductVariant {
    id: string;
    price: number;
    stock: number;
    variantName: string;
    isDefault: boolean;
    attributes: Record<string, string>;
}

interface ProductPurchaseSectionProps {
    product: {
        id: string;
        name: string;
        images: string[];
        variants: ProductVariant[];
    };
}

export function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
    const { addItem } = useCart();

    // Get default variant or first variant
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(
        defaultVariant?.attributes || {}
    );

    // Get all attribute keys from variants 
    const getAttributeKeys = () => {
        const keys = new Set<string>();
        product.variants.forEach(variant => {
            Object.keys(variant.attributes || {}).forEach(key => keys.add(key));
        });
        return Array.from(keys);
    };

    // Get unique values for a specific attribute
    const getUniqueAttributeValues = (attributeKey: string) => {
        const values = product.variants
            .map(variant => variant.attributes[attributeKey])
            .filter(Boolean)
            .filter((value, index, array) => array.indexOf(value) === index);
        return values;
    };

    // Check if a specific attribute value combination is available
    const isAttributeCombinationAvailable = (attributeKey: string, value: string) => {
        // Create test attributes with the new value
        const testAttributes = { ...selectedAttributes, [attributeKey]: value };

        // Check if there's any variant that matches this specific attribute value
        // We're more lenient here - we just need at least one variant with this attribute value
        return product.variants.some(variant => variant.attributes[attributeKey] === value);
    };

    // Find the best matching variant when an attribute is changed
    const findBestAvailableVariant = (attributeKey: string, value: string) => {
        // Find all variants that have the selected attribute value
        const variantsWithAttribute = product.variants.filter(variant =>
            variant.attributes[attributeKey] === value
        );

        if (variantsWithAttribute.length === 0) {
            return { variant: selectedVariant, attributes: selectedAttributes };
        }

        // Try to find a variant that matches as many current attributes as possible
        let bestMatch = variantsWithAttribute[0];
        let maxMatches = 0;

        for (const variant of variantsWithAttribute) {
            let matches = 0;
            for (const [key, val] of Object.entries(selectedAttributes)) {
                if (key !== attributeKey && variant.attributes[key] === val) {
                    matches++;
                }
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = variant;
            }
        }

        return {
            variant: bestMatch,
            attributes: bestMatch.attributes
        };
    };

    // Find variant based on current selected attributes (exact match)
    const findVariantByAttributes = (attributes: Record<string, string>) => {
        return product.variants.find(variant => {
            return Object.entries(attributes).every(([key, value]) =>
                variant.attributes[key] === value
            );
        });
    };

    // Handle attribute selection change
    const handleAttributeChange = (attributeKey: string, value: string) => {
        const { variant, attributes } = findBestAvailableVariant(attributeKey, value);

        setSelectedAttributes(attributes);
        setSelectedVariant(variant);
    };

    // Update selected variant when attributes change
    useEffect(() => {
        const variant = findVariantByAttributes(selectedAttributes);
        if (variant && variant.id !== selectedVariant.id) {
            setSelectedVariant(variant);
        }
    }, [selectedAttributes]);

    const attributeKeys = getAttributeKeys();

    const handleAddToCart = () => {
        if (!selectedVariant || !product) {
            toast.error("Product not available");
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
            attributes: selectedVariant.attributes
        });

        toast.success("Added to cart", {
            description: `${product.name} (${selectedVariant.variantName}) has been added to your cart.`,
        });
    };

    return (
        <div className="space-y-6">
            {/* Dynamic Attribute Selectors */}
            {attributeKeys.map(attributeKey => {
                const values = getUniqueAttributeValues(attributeKey);
                if (values.length === 0) return null;

                return (
                    <div key={attributeKey}>
                        <h4 className="font-semibold text-gray-900 mb-3 uppercase">
                            {attributeKey.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                            {values.map((value) => {
                                const isSelected = selectedAttributes[attributeKey] === value;
                                const isDirectlyAvailable = isAttributeCombinationAvailable(attributeKey, value);
                                const hasVariantWithThisValue = product.variants.some(v =>
                                    v.attributes[attributeKey] === value
                                );

                                // Simplified states: selected, available, or disabled
                                const isAvailable = isDirectlyAvailable || hasVariantWithThisValue;

                                return (
                                    <button
                                        key={value}
                                        onClick={() => {
                                            if (isAvailable) {
                                                handleAttributeChange(attributeKey, value);
                                            }
                                        }}
                                        disabled={!isAvailable}
                                        className={`px-4 py-2 rounded-lg border font-medium transition-colors ${isSelected
                                                ? "bg-orange-400 text-white border-orange-400"
                                                : isAvailable
                                                    ? "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                                                    : "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed opacity-50"
                                            }`}
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Current Selection Display */}
            <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Current Selection:</h5>
                <div className="text-sm text-gray-600 mb-3">
                    {Object.entries(selectedAttributes).map(([key, value]) => (
                        <span key={key} className="inline-block mr-4">
                            <strong>{key}:</strong> {value}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-700">Price:</span>
                    <span className="text-2xl font-bold text-orange-600">
                        ₹{selectedVariant.price}
                    </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    {selectedVariant.stock > 0 ? (
                        <span className="text-green-600">
                            ✓ In Stock ({selectedVariant.stock} available)
                        </span>
                    ) : (
                        <span className="text-red-600">
                            ✗ Out of Stock
                        </span>
                    )}
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
                {!selectedVariant || selectedVariant.stock <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
            </button>
        </div>
    );
}
