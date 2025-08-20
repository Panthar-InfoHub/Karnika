import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
import { getSession } from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
    }

    // Verify order belongs to user and is in PENDING status
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    if (order.paymentStatus !== "PENDING") {
      return NextResponse.json({ message: "Order is not in pending status" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create Razorpay order with our order ID as receipt
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: order.id, // Link to our order
    });

    // Update order with Razorpay order ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayOrderId: razorpayOrder.id
      }
    });

    return NextResponse.json({
      ...razorpayOrder,
      orderId: order.id
    });
  } catch (err: any) {
    console.error("Error creating Razorpay order:", err);
    return NextResponse.json({ message: err.message || "Failed to create payment order" }, { status: 500 });
  }
}
