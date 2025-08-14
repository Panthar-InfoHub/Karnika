import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
import { getSession } from "@/utils/auth-utils";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paymentResponse, orderId } = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResponse;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: "Missing payment information" }, { status: 400 });
    }

    // Verify the order exists and belongs to user
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

    if (order.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json({ message: "Order ID mismatch" }, { status: 400 });
    }

    // Verify Razorpay signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("Payment signature verification failed");
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    // Update order status - payment successful
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order with payment details
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "SUCCESS",
          orderStatus: "CONFIRMED",
          razorpayPaymentId: razorpay_payment_id,
          paymentCapturedAt: new Date(),
          paymentMethod: "razorpay"
        }
      });

      // Reduce stock for each item
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId! },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        // Also update total product stock
        await tx.product.update({
          where: { id: item.productId! },
          data: {
            totalStock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return updated;
    });

    return NextResponse.json({ 
      success: true, 
      orderId: updatedOrder.id,
      message: "Payment verified and order confirmed"
    });

  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
