import { prisma } from "@/prisma/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductImageGallery } from "@/components/home/ProductImageGallery";
import { ProductDetails } from "@/components/home/ProductDetails";


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
          <ProductDetails product={serializedProduct} />
        </div>
      </div>
    </div>
  );
}
