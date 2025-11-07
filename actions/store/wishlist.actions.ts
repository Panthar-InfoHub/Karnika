"use server";

import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { transformProductsWithSignedUrls } from "@/lib/image-utils";

// Get user's wishlist
export async function getWishlist() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { success: true, data: { items: [] } };
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform products with signed URLs
    const products = wishlistItems.map((item) => item.product);
    const productsWithSignedUrls = await transformProductsWithSignedUrls(products);

    const enrichedItems = wishlistItems.map((item, index) => ({
      id: item.id,
      productId: item.productId,
      product: productsWithSignedUrls[index],
      createdAt: item.createdAt,
    }));

    return { success: true, data: { items: enrichedItems } };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { success: false, error: "Failed to fetch wishlist" };
  }
}

// Add item to wishlist
export async function addToWishlist(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { success: false, error: "Please login to add items to wishlist" };
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return { success: false, error: "Item already in wishlist" };
    }

    await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Item added to wishlist" };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { success: false, error: "Failed to add item to wishlist" };
  }
}

// Remove item from wishlist
export async function removeFromWishlist(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { success: false, error: "Please login to manage wishlist" };
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    revalidatePath("/");
    return { success: true, message: "Item removed from wishlist" };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { success: false, error: "Failed to remove item from wishlist" };
  }
}

// Toggle wishlist item (add if not exists, remove if exists)
export async function toggleWishlist(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { success: false, error: "Please login to manage wishlist" };
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
      });
      revalidatePath("/");
      return { success: true, message: "Removed from wishlist", isInWishlist: false };
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });
      revalidatePath("/");
      return { success: true, message: "Added to wishlist", isInWishlist: true };
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return { success: false, error: "Failed to update wishlist" };
  }
}

// Check if product is in wishlist
export async function isInWishlist(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { success: true, data: { isInWishlist: false } };
    }

    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return { success: true, data: { isInWishlist: !!item } };
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return { success: false, error: "Failed to check wishlist" };
  }
}

// Clear entire wishlist
export async function clearWishlist() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { success: false, error: "Please login to manage wishlist" };
    }

    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id },
    });

    revalidatePath("/");
    return { success: true, message: "Wishlist cleared" };
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return { success: false, error: "Failed to clear wishlist" };
  }
}
