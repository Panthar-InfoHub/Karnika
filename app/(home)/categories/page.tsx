import { prisma } from "@/prisma/db";
import Image from "next/image";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            All Categories
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our wide range of product categories
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-500">
              Categories will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-100 group-hover:border-green-200">
                  <div className="mb-4">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-2xl">📦</div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="mt-4 inline-flex items-center text-green-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View Products
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/"
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
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
