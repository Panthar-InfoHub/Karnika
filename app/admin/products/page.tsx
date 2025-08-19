import { ProductsTable } from "@/components/dashboard/products/products-table"
import { prisma } from "@/prisma/db";
import { Suspense } from "react";
import PageSkeleton from "@/components/dashboard/PageSkeleton";
import ErrorCard from "@/components/ErrorCard";

export default async function Products() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}

async function getProductsData() {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          variants: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    return { products, categories };
  } catch (error) {
    throw new Error("Failed to load products data");
  }
}

async function ProductsContent() {
  try {
    const { products, categories } = await getProductsData()

    return <ProductsTable products={products} categories={categories} />
  } catch (error) {
    return <ErrorCard title="Products" error={error as Error} />
  }
}

