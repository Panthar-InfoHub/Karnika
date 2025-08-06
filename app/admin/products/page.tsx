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
import { Skeleton } from "@/components/ui/skeleton";

export default async function Products() {
  return (
    <Suspense fallback={<ProductsLoading />}>
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

function ProductsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
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
