import { prisma } from "@/prisma/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductPurchase } from "@/components/home/ProductPurchase";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      variants: {
        orderBy: { isDefault: "desc" },
      },
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Serialize the product data for the client component
  const serializedProduct = {
    id: product.id,
    name: product.name,
    images: product.images,
    variants: product.variants.map(variant => ({
      id: variant.id,
      price: variant.price,
      stock: variant.stock,
      variantName: variant.variantName,
      isDefault: variant.isDefault,
      attributes: typeof variant.attributes === 'object' && variant.attributes 
        ? variant.attributes as Record<string, string>
        : {}
    }))
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.images.length > 0 && (
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover"
              />
            </div>
          )}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.category && (
              <Badge variant="outline" className="mt-2">
                {product.category.name}
              </Badge>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">
              Total Stock: {product.totalStock}
            </p>
          </div>

          {/* Purchase Component */}
          <ProductPurchase product={serializedProduct} />

          {/* Product Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Available Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{variant.variantName}</h4>
                        {variant.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{variant.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Stock: {variant.stock}
                        </p>
                      </div>
                    </div>

                    {/* Show variant attributes if any */}
                    {variant.attributes &&
                      typeof variant.attributes === "object" &&
                      Object.keys(variant.attributes).length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Attributes:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(
                              variant.attributes as Record<string, string>
                            ).map(([key, value]) => (
                              <Badge
                                key={key}
                                variant="outline"
                                className="text-xs"
                              >
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
