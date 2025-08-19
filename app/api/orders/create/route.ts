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
    fullName: string;
  };
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderItems, shippingDetails }: CreateOrderRequest = await req.json();

    // Enhanced validation
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    if (!shippingDetails.address || !shippingDetails.phone || !shippingDetails.fullName) {
      return NextResponse.json({ message: "All shipping details are required" }, { status: 400 });
    }

    // Additional validation for malicious price manipulation
    for (const item of orderItems) {
      if (!item.productId || !item.variantId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json({ 
          message: "Invalid order item data" 
        }, { status: 400 });
      }

      // Check for negative or zero prices (security validation)
      if (item.price <= 0) {
        return NextResponse.json({ 
          message: "Invalid price detected. Please refresh and try again." 
        }, { status: 400 });
      }

      // Check for unreasonably large quantities (potential abuse)
      if (item.quantity > 1000) {
        return NextResponse.json({ 
          message: "Quantity limit exceeded. Please contact support for bulk orders." 
        }, { status: 400 });
      }
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
      if (Math.abs(variant.price - item.price) > 0.01) { // Allow for minor floating point differences
        // Log potential price manipulation attempt
        console.warn(`Price manipulation attempt detected:`, {
          userId: session.user.id,
          userEmail: session.user.email,
          productId: item.productId,
          variantId: item.variantId,
          expectedPrice: variant.price,
          receivedPrice: item.price,
          timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({ 
          message: `Price mismatch for ${variant.product?.name} - ${item.variantName}. Expected: ₹${variant.price}, Received: ₹${item.price}. Please refresh and try again.` 
        }, { status: 400 });
      }

      // Additional security: Check if price was set to 0 or negative (common attack)
      if (variant.price <= 0) {
        console.error(`Invalid product price detected:`, {
          productId: item.productId,
          variantId: item.variantId,
          price: variant.price
        });
        
        return NextResponse.json({ 
          message: `Invalid product price configuration for ${variant.product?.name}. Please contact support.` 
        }, { status: 500 });
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
        address: `${shippingDetails.fullName}\n${session.user.email || ""}\n${shippingDetails.address}`,
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