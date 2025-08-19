import { prisma } from "@/prisma/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/dashboard/products/product-form";
import CreateCategory from "@/components/dashboard/category/category-create";
import ErrorCard from "@/components/ErrorCard";
import { Suspense } from "react";
import PageSkeleton from "@/components/dashboard/PageSkeleton";


export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <NewProductContent />
    </Suspense>
  );
}


async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return { categories };
  } catch (error) {
    throw new Error("Failed to load categories");
  }
}

async function NewProductContent() {
  try {
    const { categories } = await getCategories();
    return (<div className="space-y-6">
      <div className="flex justify-between item-center w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Product
            </h1>
            <p className="text-muted-foreground">
              Add a new product to your inventory
            </p>
          </div>
        </div>
        <CreateCategory />
      </div>
      <ProductForm categories={categories} mode="create" />
    </div>)
  } catch (error) {
    return <ErrorCard title="Create Product" error={error as Error} />;
  }
}


