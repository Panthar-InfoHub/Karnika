import { prisma } from "@/prisma/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductImageGallery } from "@/components/home/ProductImageGallery";
import { ProductPurchaseSection } from "@/components/home/ProductPurchaseSection";


export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug: slug },
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
    description: product.description,
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

  const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">›</span>
          {product.category && (
            <>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-green-600 transition-colors"
              >
                {product.category.name}
              </Link>
              <span className="mx-2">›</span>
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Product Images */}
          <div className="p-8">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Details */}
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

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  ₹ {defaultVariant?.price}
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
            <ProductPurchaseSection product={serializedProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}
