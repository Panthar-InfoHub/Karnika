"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/hooks/use-cart-db";
import { CartSync } from "./cart-sync";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const fetchCart = useCart((state) => state.fetchCart);
  const isInitialized = useCart((state) => state.isInitialized);

  useEffect(() => {
    // Only fetch cart for logged-in users
    if (!isInitialized && session?.user?.id) {
      fetchCart();
    }
  }, [fetchCart, isInitialized, session?.user?.id]);

  return (
    <>
      <CartSync />
      {children}
    </>
  );
}
