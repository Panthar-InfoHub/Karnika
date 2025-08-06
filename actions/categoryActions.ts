"use server";

import { generateSlug } from "@/lib/utils";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = generateSlug(name);
  const category = await prisma.category.create({
    data: {
      name,
      description: "This is a default description for the category.",
      image:
        "https://images.unsplash.com/photo-1750262773909-6128fb43f1d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D",
      slug,
    },
  });

  revalidatePath("/admin/categories");
}
