"use server";

import { prisma } from "@/prisma/db";
import { getSession } from "@/utils/auth-utils";
import { revalidatePath } from "next/cache";

interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number; // Price at time of order
  productName: string;
  variantName: string;
}

export async function CreateOrder(
  orderItems: OrderItem[],
  shippingDetails: {
    address: string;
    phone: string;
  }
) {
  if (orderItems.length === 0) throw new Error("Cart is empty");

  // Validate stock availability for all items
  for (const item of orderItems) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      select: { stock: true, product: { select: { name: true } } },
    });

    if (!variant) {
      throw new Error(`Variant ${item.variantName} not found`);
    }

    if (variant.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${variant.product?.name} - ${item.variantName}. Available: ${variant.stock}, Requested: ${item.quantity}`
      );
    }
  }

  const total = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const session = await getSession();
  if (!session) throw new Error("User not authenticated");

  const userId = session.user.id;

  try {
    // Use transaction to ensure atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: total,
          address: shippingDetails.address,
          phone: shippingDetails.phone,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              variantName: item.variantName,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      // Update stock for each variant
      for (const item of orderItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        // Also update total product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            totalStock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    revalidatePath("/account/orders");
    revalidatePath("/admin/orders");
    return order;
  } catch (error) {
    console.error("Error placing order:", error);
    throw new Error("Failed to place order. Please try again.");
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                slug: true,
              },
            },
            variant: {
              select: {
                variantName: true,
                attributes: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                slug: true,
              },
            },
            variant: {
              select: {
                variantName: true,
                attributes: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function updateOrderStatus(
  orderId: string,
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PACKED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                slug: true,
              },
            },
            variant: {
              select: {
                variantName: true,
                attributes: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, order };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
