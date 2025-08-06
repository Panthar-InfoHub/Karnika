import { prisma } from "@/prisma/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CategoriesTable from "@/components/dashboard/categories-table";

async function getCategoriesData() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to load categories");
  }
}

function CategoriesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
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
                <Skeleton className="h-4 w-24" />
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

function CategoriesError({ error }: { error: Error }) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription className="text-destructive">
            Failed to load categories: {error.message}
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

async function CategoriesContent() {
  try {
    const { categories } = await getCategoriesData();
    return <CategoriesTable categories={categories} />;
  } catch (error) {
    return <CategoriesError error={error as Error} />;
  }
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesContent />
    </Suspense>
  );
}
