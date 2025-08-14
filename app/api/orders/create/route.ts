import { NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
import { getSession } from "@/utils/auth-utils";

interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  productName: string;
  variantName: string;
}

interface CreateOrderRequest {
  orderItems: OrderItem[];
  shippingDetails: {
    address: string;
    phone: string;
  };
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderItems, shippingDetails }: CreateOrderRequest = await req.json();

    // Validation
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    if (!shippingDetails.address || !shippingDetails.phone) {
      return NextResponse.json({ message: "Shipping details are required" }, { status: 400 });
    }

    // Validate each item against database (price and stock)
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: {
          product: {
            select: { id: true, name: true }
          }
        }
      });

      if (!variant) {
        return NextResponse.json({ 
          message: `Product variant ${item.variantName} not found` 
        }, { status: 400 });
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json({ 
          message: `Insufficient stock for ${variant.product?.name} - ${item.variantName}. Available: ${variant.stock}` 
        }, { status: 400 });
      }

      // Validate price (prevent price manipulation)
      if (variant.price !== item.price) {
        return NextResponse.json({ 
          message: `Price mismatch for ${variant.product?.name}. Please refresh and try again.` 
        }, { status: 400 });
      }

      calculatedTotal += item.quantity * variant.price;
      validatedItems.push({
        ...item,
        productId: variant.productId,
        productName: variant.product?.name || item.productName,
        price: variant.price // Use validated price
      });
    }

    // Create order with PENDING status
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: calculatedTotal,
        address: shippingDetails.address,
        phone: shippingDetails.phone,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        items: {
          create: validatedItems.map((item) => ({
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
        items: true
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalAmount: calculatedTotal,
      message: "Order created successfully"
    });

  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}