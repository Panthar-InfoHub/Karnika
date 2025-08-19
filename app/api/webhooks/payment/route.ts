import { prisma } from "@/prisma/db";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Get the signature from headers
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Get raw body for signature verification
    const body = await req.text();

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(body);
    const event = webhookData.event;
    const payment = webhookData.payload.payment.entity;


    // Handle payment.captured event
    if (event === "payment.captured") {
      await prisma.order.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: {
          paymentStatus: "SUCCESS",
          razorpayPaymentId: payment.id,
          paymentMethod: payment.method,
          paymentCapturedAt: new Date(),
          paymentMeta: payment,
        },
      });

    }

    // Handle payment.failed event
    if (event === "payment.failed") {
      await prisma.order.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: {
          paymentStatus: "FAILED",
          paymentCapturedAt: new Date(),
          paymentMeta: payment,
          paymentMethod: payment.method,
          razorpayPaymentId: payment.id,
        },
      });

    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
