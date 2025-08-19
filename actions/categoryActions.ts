"use server";

import { generateSlug } from "@/lib/utils";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const id = formData.get("id") as string;

  const slug = generateSlug(name);

  try {
    if (id) {
      // Edit existing category
      await prisma.category.update({
        where: { id },
        data: {
          name,
          description,
          image,
          slug,
        },
      });
    } else {
      // Create new category
      await prisma.category.create({
        data: {
          name,
          description,
          image,
          slug,
        },
      });
    }
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    revalidatePath("/categories");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { error: id ? "Failed to update category" : "Failed to create category" };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/");
  } catch (error) {
    return { error: "Failed to delete category" };
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        products: {
          include: {
            category: true,
            variants: {
              where: {
                isDefault: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return category;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
}
