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
  categoryId: z.string().optional(),
  stock: z.coerce.number(),
  variants: z.array(z.string()),
});

const ProductUpdateSchema = z.object({
  productId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string()).min(1),
  price: z.coerce.number(),
  categoryId: z.string().optional(),
  stock: z.coerce.number().optional(),
  variants: z.array(z.string()),
});

export async function createProductAction(formData: FormData) {
  const rawObject = Object.fromEntries(formData.entries());

  // Handle images array from FormData
  const images: string[] = [];
  const variants: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("images[") && typeof value === "string") {
      images.push(value);
    }
    if (key.startsWith("variants[") && typeof value === "string") {
      variants.push(value);
    }
  }
  const parsed = ProductCreateSchema.safeParse({
    ...rawObject,
    images,
    variants,
    price: rawObject.price,
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

  const images: string[] = [];
  const variants: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("images[") && typeof value === "string") {
      images.push(value);
    }
    if (key.startsWith("variants[") && typeof value === "string") {
      variants.push(value);
    }
  }

  const parsed = ProductUpdateSchema.safeParse({
    ...rawObject,
    images,
    variants,
    price: rawObject.price, // Convert to cents
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
