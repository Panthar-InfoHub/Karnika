"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/ui/tags-input";

interface VariantAttribute {
  name: string;
  values: string[];
}

interface GeneratedVariant {
  id?: string;
  attributes: Record<string, string>;
  variantName: string;
  price: number;
  stock: number;
  isDefault?: boolean;
}

interface VariantManagerProps {
  onVariantsChange: (variants: GeneratedVariant[]) => void;
  initialVariants?: GeneratedVariant[];
  basePrice?: number;
  baseStock?: number;
}

export function VariantManager({ 
  onVariantsChange, 
  initialVariants = [],
  basePrice = 0,
  baseStock = 0
}: VariantManagerProps) {
  const [hasVariants, setHasVariants] = useState(initialVariants.length > 0);
  const [attributes, setAttributes] = useState<VariantAttribute[]>(
    initialVariants.length > 0 ? extractAttributesFromVariants(initialVariants) : []
  );
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>(
    initialVariants.length > 0 ? initialVariants : []
  );

  // Extract attribute structure from existing variants
  function extractAttributesFromVariants(variants: GeneratedVariant[]): VariantAttribute[] {
    if (variants.length === 0) return [];
    
    const attributeMap: Record<string, Set<string>> = {};
    
    variants.forEach(variant => {
      // Handle JsonValue type from Prisma
      const attributes = typeof variant.attributes === 'object' && variant.attributes 
        ? variant.attributes as Record<string, string>
        : {};
      
      Object.entries(attributes).forEach(([key, value]) => {
        if (!attributeMap[key]) attributeMap[key] = new Set();
        attributeMap[key].add(String(value));
      });
    });

    return Object.entries(attributeMap).map(([name, values]) => ({
      name,
      values: Array.from(values)
    }));
  }

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", values: [""] }]);
  };

  const removeAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
    if (newAttributes.length === 0) {
      setGeneratedVariants([]);
      onVariantsChange([]);
    } else {
      generateVariants(newAttributes);
    }
  };

  const updateAttributeName = (index: number, name: string) => {
    const newAttributes = [...attributes];
    newAttributes[index].name = name;
    setAttributes(newAttributes);
    if (name && newAttributes[index].values.some(v => v.trim())) {
      generateVariants(newAttributes);
    }
  };

  const updateAttributeValue = (attrIndex: number, values: string[]) => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].values = values;
    setAttributes(newAttributes);
    if (newAttributes[attrIndex].name && values.length > 0) {
      generateVariants(newAttributes);
    }
  };

  const addAttributeValue = (attrIndex: number) => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].values.push("");
    setAttributes(newAttributes);
  };

  const removeAttributeValue = (attrIndex: number, valueIndex: number) => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].values = newAttributes[attrIndex].values.filter((_, i) => i !== valueIndex);
    setAttributes(newAttributes);
    generateVariants(newAttributes);
  };

  const generateVariants = (attrs: VariantAttribute[]) => {
    const validAttrs = attrs.filter(attr => 
      attr.name.trim() && attr.values.some(v => v.trim())
    );

    if (validAttrs.length === 0) {
      setGeneratedVariants([]);
      onVariantsChange([]);
      return;
    }

    // Generate all combinations
    const combinations = generateCombinations(validAttrs);
    const newVariants: GeneratedVariant[] = combinations.map(combo => {
      // Check if this variant already exists
      const existing = generatedVariants.find(v => 
        JSON.stringify(v.attributes) === JSON.stringify(combo.attributes)
      );

      return {
        id: existing?.id,
        attributes: combo.attributes,
        variantName: combo.variantName,
        price: existing?.price || basePrice,
        stock: existing?.stock || Math.floor(baseStock / combinations.length) || 0
      };
    });

    setGeneratedVariants(newVariants);
    onVariantsChange(newVariants);
  };

  const generateCombinations = (attrs: VariantAttribute[]): GeneratedVariant[] => {
    const cleanAttrs = attrs.map(attr => ({
      ...attr,
      values: attr.values.filter(v => v.trim())
    })).filter(attr => attr.values.length > 0);

    if (cleanAttrs.length === 0) return [];

    let combinations = [{}];

    cleanAttrs.forEach(attr => {
      const newCombinations: Record<string, string>[] = [];
      combinations.forEach(combo => {
        attr.values.forEach(value => {
          newCombinations.push({
            ...combo,
            [attr.name]: value
          });
        });
      });
      combinations = newCombinations;
    });

    return combinations.map((combo, index) => ({
      attributes: combo,
      variantName: Object.values(combo).join(" - "),
      price: basePrice,
      stock: Math.floor(baseStock / combinations.length) || 0
    }));
  };

  const updateVariantPrice = (index: number, price: number) => {
    const newVariants = [...generatedVariants];
    newVariants[index].price = price;
    setGeneratedVariants(newVariants);
    onVariantsChange(newVariants);
  };

  const updateVariantStock = (index: number, stock: number) => {
    const newVariants = [...generatedVariants];
    newVariants[index].stock = stock;
    setGeneratedVariants(newVariants);
    onVariantsChange(newVariants);
  };

  const handleVariantToggle = (enabled: boolean) => {
    setHasVariants(enabled);
    if (!enabled) {
      setAttributes([]);
      setGeneratedVariants([]);
      onVariantsChange([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Product Variants
          <div className="flex items-center space-x-2">
            <Label htmlFor="variant-toggle" className="text-sm font-normal">
              Enable Variants
            </Label>
            <Switch
              id="variant-toggle"
              checked={hasVariants}
              onCheckedChange={handleVariantToggle}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasVariants ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>This product will use default pricing and stock.</p>
            <p className="text-sm">Enable variants to add different options like colors, sizes, etc.</p>
          </div>
        ) : (
          <>
            {/* Attribute Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Variant Attributes</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttribute}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attribute
                </Button>
              </div>

              {attributes.map((attribute, attrIndex) => (
                <Card key={attrIndex} className="border-dashed">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Attribute name (e.g., Color, Size)"
                          value={attribute.name}
                          onChange={(e) => updateAttributeName(attrIndex, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeAttribute(attrIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Values</Label>
                        <TagsInput
                          value={attribute.values.filter(v => v.trim())}
                          onValueChange={(values) => updateAttributeValue(attrIndex, values)}
                          placeholder="Type values and press Enter (e.g., Red, Blue, Green)"
                          className="border rounded-md p-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          Type each value and press Enter to add it
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Generated Variants */}
            {generatedVariants.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Generated Variants ({generatedVariants.length})</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {generatedVariants.map((variant, index) => (
                    <Card key={index} className="border">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">{variant.variantName}</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(variant.attributes).map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="text-xs">
                                  {key}: {value}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`price-${index}`} className="text-sm">Price (₹)</Label>
                              <Input
                                id={`price-${index}`}
                                type="number"
                                step="0.01"
                                min="0"
                                value={variant.price}
                                onChange={(e) => updateVariantPrice(index, e.target.value ? parseFloat(e.target.value) : 0)}
                                placeholder="0.00"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`stock-${index}`} className="text-sm">Stock</Label>
                              <Input
                                id={`stock-${index}`}
                                type="number"
                                min="0"
                                value={variant.stock}
                                onChange={(e) => updateVariantStock(index, parseInt(e.target.value || "0"))}
                                placeholder="0"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
