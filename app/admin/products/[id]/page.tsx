import { prisma } from "@/prisma/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";
import ErrorCard from "@/components/ErrorCard";
import { Suspense } from "react";
import PageSkeleton from "@/components/dashboard/PageSkeleton";


export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <EditProductContent id={id} />
    </Suspense>
  );
}

async function getProductData(id: string) {
  try {
    const [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          variants: true,
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
    if (!product) {
      notFound();
    }

    return { product, categories };
  } catch (error) {
    throw new Error("Failed to load product data");
  }
}

async function EditProductContent({ id }: { id: string }) {
  try {
    const { product, categories } = await getProductData(id);
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
        <ProductForm
          product={product}
          categories={categories}
          mode="edit"
        />
      </div>

    );
  } catch (error) {
    return (
      <ErrorCard
        title="Edit Product"
        error={error as Error}
      />
    );
  }
}

