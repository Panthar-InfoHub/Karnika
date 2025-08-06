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
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";

async function getProductData(id: string) {
  try {
    const [product, categories, media] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
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
      // Placeholder for media
      Promise.resolve([]),
    ]);

    if (!product) {
      notFound();
    }

    return { product, categories, media };
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    throw new Error("Failed to load product data");
  }
}

async function EditProductContent({ id }: { id: string }) {
  try {
    const { product, categories, media } = await getProductData(id);
    return (
      <ProductForm
        product={product}
        categories={categories}
        media={media}
        mode="edit"
      />
    );
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

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>
      </div>

      <EditProductContent id={params.id} />
    </div>
  );
}
