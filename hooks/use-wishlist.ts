"use client";

import { create } from "zustand";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  isInWishlist,
  clearWishlist,
} from "@/actions/store/wishlist.actions";

interface WishlistItem {
  id: string;
  productId: string;
  product: any;
  createdAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  wishlistProductIds: Set<string>;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  removeItem: (
    productId: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  toggleItem: (
    productId: string
  ) => Promise<{ success: boolean; message?: string; error?: string; isInWishlist?: boolean }>;
  checkItem: (productId: string) => Promise<boolean>;
  clearWishlistItems: () => Promise<{ success: boolean; message?: string; error?: string }>;
  isInWishlistLocal: (productId: string) => boolean;
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: [],
  wishlistProductIds: new Set(),
  isLoading: false,
  isInitialized: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const result = await getWishlist();
      if (result.success && result.data) {
        const productIds = new Set(result.data.items.map((item) => item.productId));
        set({
          items: result.data.items,
          wishlistProductIds: productIds,
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId: string) => {
    const result = await addToWishlist(productId);
    if (result.success) {
      // Refresh wishlist
      await get().fetchWishlist();
    }
    return result;
  },

  removeItem: async (productId: string) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      // Refresh wishlist
      await get().fetchWishlist();
    }
    return result;
  },

  toggleItem: async (productId: string) => {
    const result = await toggleWishlist(productId);
    if (result.success) {
      // Refresh wishlist
      await get().fetchWishlist();
    }
    return result;
  },

  checkItem: async (productId: string) => {
    const result = await isInWishlist(productId);
    return result.success && result.data ? result.data.isInWishlist : false;
  },

  clearWishlistItems: async () => {
    const result = await clearWishlist();
    if (result.success) {
      set({ items: [], wishlistProductIds: new Set() });
    }
    return result;
  },

  isInWishlistLocal: (productId: string) => {
    return get().wishlistProductIds.has(productId);
  },
}));
