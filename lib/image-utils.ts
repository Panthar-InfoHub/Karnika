"use server";

import { getSignedViewUrl } from "./cloud-storage";

/**
 * Transform product data with signed URLs (valid for 7 days)
 */
export async function transformProductWithSignedUrls<T extends { images: string[] }>(
  product: T
): Promise<T> {
  const signedImages = await Promise.all(product.images.map((img) => getSignedViewUrl(img)));
  return {
    ...product,
    images: signedImages,
  };
}

/**
 * Transform multiple products with signed URLs (valid for 7 days)
 */
export async function transformProductsWithSignedUrls<T extends { images: string[] }>(
  products: T[]
): Promise<T[]> {
  return Promise.all(products.map((product) => transformProductWithSignedUrls(product)));
}
