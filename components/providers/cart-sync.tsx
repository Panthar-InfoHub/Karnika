"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/hooks/use-cart-db";
import { mergeGuestCart } from "@/actions/store/cart.actions";

/**
 * CartSync component handles automatic cart synchronization
 * when user authentication state changes
 */
export function CartSync() {
  const { data: session } = useSession();
  const { fetchCart } = useCart();
  const hasProcessedRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const userId = session?.user?.id;

    // User just logged in (userId changed from null to a value)
    if (userId && previousUserIdRef.current !== userId && !hasProcessedRef.current) {
      hasProcessedRef.current = true;

      // Ensure user has a cart and fetch it
      mergeGuestCart(userId)
        .then(() => {
          // Fetch user's cart
          return fetchCart();
        })
        .catch((error) => {
          console.error("Error initializing cart:", error);
        })
        .finally(() => {
          // Reset flag after a delay to allow re-syncing if needed
          setTimeout(() => {
            hasProcessedRef.current = false;
          }, 1000);
        });
    }

    // User logged out (userId changed from a value to null)
    if (!userId && previousUserIdRef.current) {
      // Clear cart since guests cannot have carts
      fetchCart();
    }

    previousUserIdRef.current = userId || null;
  }, [session?.user?.id, fetchCart]);

  return null; // This component doesn't render anything
}
