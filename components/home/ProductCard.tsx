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
import { Product } from "@/prisma/generated/prisma";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  variants?: string[];
}

const ProductCard = ({
  id,
  name,
  price,
  images,
  variants,
}: Partial<Product>) => {
  const [selectedVariant, setSelectedVariant] = useState(variants?.[0] || "");
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!name || !price || !images || !id) {
      toast.error("Invalid selection");
      return;
    }

    addItem({
      id,
      name: name,
      price: price,
      image: images?.[0],
      variant: selectedVariant,
    });

    toast("Added to cart", {
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 animate-fade-in ">
      <CardContent className="px-4">
        <div className="aspect-square mb-4 h-32 overflow-hidden rounded-lg mx-auto relative">
          <img
            src={images?.[0] }
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h3 className=" font-semibold text-farm-navy mb-2 group-hover:text-farm-orange transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <span className=" font-bold text-farm-navy">₹{price}</span>
          {price && (
            <span className="text-sm text-gray-500 line-through">
              ₹{price}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {variants && variants.length > 0 && (
            <div className="">
              <Select
                value={selectedVariant}
                onValueChange={setSelectedVariant}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((variant, index) => (
                    <SelectItem key={index} value={variant}>
                      {variant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            className=" font-semibold transition-all duration-300 hover:scale-105"
            size="sm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
