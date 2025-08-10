"use server";

import { generateSlug } from "@/lib/utils";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  const slug = generateSlug(name);

  console.log("Creating category with data:", { name, description, image, slug });
  await prisma.category.create({
    data: {
      name,
      description,
      image,
      slug,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
}

export async function deleteCategoryAction(categoryId: string) {
  console.log("Deleting category with ID:", categoryId);
  await prisma.category.delete({
    where: { id: categoryId },
  });

  revalidatePath("/admin/categories");
}