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
import PageSkeleton from "@/components/dashboard/PageSkeleton";

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



export default function CategoriesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategoriesContent />
    </Suspense>
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

