import { ProductsTable } from "@/components/dashboard/products-table"
import { prisma } from "@/prisma/db";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageSkeleton from "@/components/dashboard/PageSkeleton";

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
    console.error("Failed to fetch products data:", error);
    throw new Error("Failed to load products data");
  }
}

async function ProductsContent() {
  try {
    const { products, categories } = await getProductsData()
    return <ProductsTable products={products} categories={categories} />
  } catch (error) {
    return <ProductsError error={error as Error} />
  }
}


// Error component
function ProductsError({ error }: { error: Error }) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription className="text-destructive">
            Failed to load products: {error.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
