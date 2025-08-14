"use server";

import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";

interface VariantData {
  id?: string;
  attributes: Record<string, string>;
  variantName: string;
  price: number;
  stock: number;
}

// Create or update product variants
export async function createOrUpdateVariants(
  productId: string,
  variants: VariantData[]
) {
  try {
    // Delete existing variants for this product
    await prisma.productVariant.deleteMany({
      where: { productId }
    });

    if (variants.length === 0) {
      // Create default variant if no variants provided
      await prisma.productVariant.create({
        data: {
          productId,
          price: 0, // Will be set from product form
          stock: 0, // Will be set from product form
          attributes: {},
          variantName: "Default",
          isDefault: true
        }
      });
    } else {
      // Create new variants
      await prisma.productVariant.createMany({
        data: variants.map(variant => ({
          productId,
          price: variant.price,
          stock: variant.stock,
          attributes: variant.attributes,
          variantName: variant.variantName,
          isDefault: false
        }))
      });
    }

    // Update product total stock
    const totalStock = variants.reduce((sum: number, variant: VariantData) => sum + variant.stock, 0);
    await prisma.product.update({
      where: { id: productId },
      data: { totalStock }
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error creating/updating variants:", error);
    return { success: false, error: "Failed to save variants" };
  }
}

// Get product with variants
export async function getProductWithVariants(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
        category: true
      }
    });

    return product;
  } catch (error) {
    console.error("Error fetching product with variants:", error);
    return null;
  }
}

// Get single variant
export async function getVariant(variantId: string) {
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });

    return variant;
  } catch (error) {
    console.error("Error fetching variant:", error);
    return null;
  }
}

// Update variant stock (for inventory management)
export async function updateVariantStock(variantId: string, newStock: number) {
  try {
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock }
    });

    // Update product total stock
    const allVariants = await prisma.productVariant.findMany({
      where: { productId: variant.productId }
    });
    
    const totalStock = allVariants.reduce((sum: number, v: any) => sum + v.stock, 0);
    await prisma.product.update({
      where: { id: variant.productId },
      data: { totalStock }
    });

    revalidatePath("/admin/products");
    revalidatePath(`/product/${variant.productId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating variant stock:", error);
    return { success: false, error: "Failed to update stock" };
  }
}

// Get default variant for a product
export async function getDefaultVariant(productId: string) {
  try {
    let defaultVariant = await prisma.productVariant.findFirst({
      where: { 
        productId,
        isDefault: true
      }
    });

    // If no default variant exists, get the first variant
    if (!defaultVariant) {
      defaultVariant = await prisma.productVariant.findFirst({
        where: { productId }
      });
    }

    return defaultVariant;
  } catch (error) {
    console.error("Error fetching default variant:", error);
    return null;
  }
}

// Check variant availability
export async function checkVariantAvailability(variantId: string, quantity: number) {
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { stock: true }
    });

    if (!variant) {
      return { available: false, message: "Variant not found" };
    }

    if (variant.stock < quantity) {
      return { 
        available: false, 
        message: `Only ${variant.stock} items available` 
      };
    }

    return { available: true };
  } catch (error) {
    console.error("Error checking variant availability:", error);
    return { available: false, message: "Error checking availability" };
  }
}
