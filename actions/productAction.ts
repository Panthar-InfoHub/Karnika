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
  price: z.coerce.number(), // Base price for default variant
  categoryId: z.string().optional(),
  stock: z.coerce.number(), // Base stock for default variant
  variants: z.string().optional(), // JSON string of variants
});

const ProductUpdateSchema = z.object({
  productId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string()).min(1),
  price: z.coerce.number().optional(), // Base price for default variant
  categoryId: z.string().optional(),
  stock: z.coerce.number().optional(), // Base stock for default variant
  variants: z.string().optional(), // JSON string of variants
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

  const parsed = ProductCreateSchema.safeParse({
    ...rawObject,
    images,
    price: rawObject.price,
  });

  if (!parsed.success) {

    throw new Error("Invalid product data");
  }

  const slug = generateSlug(parsed.data.name);
  const price = parsed.data.price;

  try {
    // Parse variants if provided
    let variantsData: any[] = [];
    if (parsed.data.variants) {
      try {
        variantsData = JSON.parse(parsed.data.variants);
      } catch (e) {
        console.error("Failed to parse variants:", e);
      }
    }

    // Calculate total stock
    const totalStock =
      variantsData.length > 0
        ? variantsData.reduce((sum, variant) => sum + (variant.stock || 0), 0)
        : parsed.data.stock;

    // Create product
    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        images: parsed.data.images,
        categoryId: parsed.data.categoryId,
        totalStock,
        slug,
      },
    });

    // Create variants
    if (variantsData.length > 0) {
      // Create custom variants
      await prisma.productVariant.createMany({
        data: variantsData.map((variant, index) => ({
          productId: product.id,
          price: variant.price || price,
          stock: variant.stock || 0,
          attributes: variant.attributes || {},
          variantName: variant.variantName || `Variant ${index + 1}`,
          isDefault: index === 0, // First variant is default
        })),
      });
    } else {
      // Create default variant
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          price,
          stock: parsed.data.stock,
          attributes: {},
          variantName: "Default",
          isDefault: true,
        },
      });
    }

    revalidatePath("/admin/products");
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new Error("Failed to create product - database error");
    }
    throw new Error("Failed to create product");
  }
}

export async function updateProductAction(formData: FormData) {
  const rawObject = Object.fromEntries(formData.entries());

  const images: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("images[") && typeof value === "string") {
      images.push(value);
    }
  }

  const parsed = ProductUpdateSchema.safeParse({
    ...rawObject,
    images,
    price: rawObject.price,
  });

  if (!parsed.success) {

    throw new Error("Invalid product data");
  }

  const { productId, ...updateData } = parsed.data;
  const slug = generateSlug(updateData.name);

  try {
    // Parse variants if provided
    let variantsData: any[] = [];
    if (parsed.data.variants) {
      try {
        variantsData = JSON.parse(parsed.data.variants);
      } catch (e) {
        console.error("Failed to parse variants:", e);
      }
    }

    // Calculate total stock
    const totalStock =
      variantsData.length > 0
        ? variantsData.reduce((sum, variant) => sum + (variant.stock || 0), 0)
        : parsed.data.stock;

    // Update product
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: updateData.name,
        description: updateData.description,
        images: updateData.images,
        categoryId: updateData.categoryId,
        totalStock,
        slug,
      },
    });

    // Handle variants
    if (variantsData.length > 0) {
      // Delete existing variants
      await prisma.productVariant.deleteMany({
        where: { productId },
      });

      // Create new variants
      await prisma.productVariant.createMany({
        data: variantsData.map((variant, index) => ({
          productId,
          price: variant.price || Math.round((updateData.price || 0) * 100),
          stock: variant.stock || 0,
          attributes: variant.attributes || {},
          variantName: variant.variantName || `Variant ${index + 1}`,
          isDefault: index === 0,
        })),
      });
    } else {
      // Update default variant if price/stock provided
      if (updateData.price !== undefined || updateData.stock !== undefined) {
        const defaultVariant = await prisma.productVariant.findFirst({
          where: { productId, isDefault: true },
        });

        if (defaultVariant) {
          const updateVariantData: any = {};
          if (updateData.price !== undefined) {
            updateVariantData.price = Math.round(updateData.price * 100);
          }
          if (updateData.stock !== undefined) {
            updateVariantData.stock = updateData.stock;
          }

          await prisma.productVariant.update({
            where: { id: defaultVariant.id },
            data: updateVariantData,
          });
        }
      }
    }

    revalidatePath("/admin/products");
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new Error("Failed to update product - database error");
    }
    throw new Error("Failed to update product");
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await prisma.$transaction([
      prisma.productVariant.deleteMany({
        where: { productId },
      }),
      prisma.product.delete({
        where: { id: productId },
      }),
    ]);

    revalidatePath("/admin/products");
  } catch (e) {
    console.error("Failed to delete product:", e);
    return { error: "Failed to delete product" };
  }
}
