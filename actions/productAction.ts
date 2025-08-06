"use server";

import { z, ZodError } from "zod";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@/prisma/generated/prisma/runtime/library";
import { generateSlug } from "@/lib/utils";

const ProductCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string()).min(1),
  price: z.coerce.number(),
  categoryId: z.string(),
  stock: z.coerce.number(),
  variants: z.array(z.string()).min(1),
});

const ProductUpdateSchema = z.object({
  productId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string()).min(1),
  price: z.coerce.number(),
  categoryId: z.string(),
  stock: z.coerce.number(),
  variants: z.array(z.string()).min(1),
});

export async function createProductAction(formData: FormData) {
  const rawObject = Object.fromEntries(formData.entries());

  // Handle images array from FormData
  const images: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("images[") && typeof value === "string") {
      images.push(value);
    }
  }

  // Handle variants from comma-separated string
  const variantsString = formData.get("variants") as string;
  const variants = variantsString
    ? variantsString
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
    : [];

  const parsed = ProductCreateSchema.safeParse({
    ...rawObject,
    images:
      images.length > 0
        ? images
        : [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
          ],
    variants,
    price: Number(rawObject.price) * 100, // Convert to cents
  });

  if (!parsed.success) {
    console.log(
      parsed.error.flatten().fieldErrors,
      "Failed to parse product data"
    );
    throw new Error("Invalid product data");
  }

  const slug = generateSlug(parsed.data.name);
  const data = { ...parsed.data, slug };

  try {
    await prisma.product.create({
      data,
    });
    revalidatePath("/admin/products");
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.message);
      throw new Error("Failed to create product - database error");
    }
    throw new Error("Failed to create product");
  }
}

export async function updateProductAction(formData: FormData) {
  const rawObject = Object.fromEntries(formData.entries());

  // Handle images array from FormData
  const images: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("images[") && typeof value === "string") {
      images.push(value);
    }
  }

  // Handle variants from comma-separated string
  const variantsString = formData.get("variants") as string;
  const variants = variantsString
    ? variantsString
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
    : ["Default"];

  const parsed = ProductUpdateSchema.safeParse({
    ...rawObject,
    images:
      images.length > 0
        ? images
        : [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
          ],
    variants,
    price: Number(rawObject.price) * 100, // Convert to cents
  });

  if (!parsed.success) {
    console.log(
      parsed.error.flatten().fieldErrors,
      "Failed to parse product data"
    );
    throw new Error("Invalid product data");
  }

  const { productId, ...updateData } = parsed.data;
  const slug = generateSlug(updateData.name);

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { ...updateData, slug },
    });
    revalidatePath("/admin/products");
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.message);
      throw new Error("Failed to update product - database error");
    }
    throw new Error("Failed to update product");
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath("/admin/products");
  } catch (e) {
    console.error("Failed to delete product:", e);
    throw new Error("Failed to delete product");
  }
}
