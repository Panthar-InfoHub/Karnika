import { prisma } from "@/prisma/db";
import { Suspense } from "react";
import CategoriesTable from "@/components/dashboard/category-table";
import PageSkeleton from "@/components/dashboard/PageSkeleton";
import ErrorCard from "@/components/ErrorCard";


export default function CategoriesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategoriesContent />
    </Suspense>
  );
}


async function CategoriesContent() {

  async function getCategoriesData() {
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
  }
  try {
    const { categories } = await getCategoriesData();
    return <CategoriesTable categories={categories} />;
  } catch (error) {
    return <ErrorCard error={error as Error} title="Categories" />;
  }
}




