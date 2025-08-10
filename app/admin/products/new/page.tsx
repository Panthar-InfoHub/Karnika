import { prisma } from "@/prisma/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/dashboard/product-form";
import CreateCategory from "@/components/dashboard/create-category";

async function getCategoriesAndMedia() {
  try {
    const [categories, media] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      // For now, we'll use a placeholder for media - you can implement this later
      Promise.resolve([]),
    ]);

    return { categories, media };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error("Failed to load form data");
  }
}

async function NewProductContent() {
  try {
    const { categories, media } = await getCategoriesAndMedia();
    return <ProductForm categories={categories} media={media} mode="create" />;
  } catch (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-destructive">
            {(error as Error).message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
}

export default function NewProductPage() {
  return (
    <div className="space-y-6">
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

      <NewProductContent />
    </div>
  );
}
