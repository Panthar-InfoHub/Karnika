"use server";

import { prisma } from "@/prisma/db";
import { getSession } from "@/utils/auth-utils";
import { revalidatePath } from "next/cache";

export async function placeOrder(
  cartItems: {
    productName: string;
    productId: string;
    quantity: number;
    price: number;
  }[]
) {
  if (cartItems.length === 0) throw new Error("Cart is empty");

  console.log("Placing order with items:", cartItems);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const session = await getSession();
  if (!session) throw new Error("User not authenticated");

  const userId = session.user.id;

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount: total,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName, // Assuming productId is the name for simplicity
          price: item.price,
          quantity: item.quantity,
        })),
      },
      address: "123 Main St, Springfield, USA",
      phone: "123-456-7890",
    },
    include: { items: true },
  });

  revalidatePath("/account/orders"); // optional: refresh order page
  return order;
}
