"use client";

import { useEffect } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useSession } from "@/lib/auth-client";

export function WishlistSync() {
  const { data: session, isPending } = useSession();
  const { fetchWishlist, items } = useWishlist();

  useEffect(() => {
    if (!isPending && session?.user) {
      // Fetch wishlist when user logs in
      fetchWishlist();
    } else if (!isPending && !session?.user) {
      // Clear wishlist when user logs out
      useWishlist.setState({ items: [], wishlistProductIds: new Set(), isInitialized: false });
    }
  }, [session?.user?.id, isPending, fetchWishlist]);

  return null;
}
