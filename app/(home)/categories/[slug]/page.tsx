import { prisma } from "@/prisma/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/home/ProductCard";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      products: {
        include: {
          category: true,
          variants: {
            where: {
              isDefault: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-white shadow-lg border-4 border-white">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gray-100">
                  📦
                </div>
              )}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {category.name}
          </h1>
          
          {category.description && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-green-600 transition-colors">
              Categories
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{category.name}</span>
          </div>
        </div>

        {/* Products Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 mb-8">
              This category doesn't have any products yet.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Products ({category.products.length})
              </h2>
              
              {/* Filter/Sort controls can be added here */}
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}

        {/* Back to Categories */}
        <div className="mt-16 text-center">
          <div className="space-x-4">
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              All Categories
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🏠 Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  });

  return categories.map((category) => ({
    slug: category.slug,
  }));
}
