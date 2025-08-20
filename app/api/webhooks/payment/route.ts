import { prisma } from "@/prisma/db";
import { sendOrderConfirmationToUser, sendOrderNotificationToAdmin } from "@/lib/sendMail";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Payment verification request received");
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
      // Update order in database
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

      // Fetch the order details for email
      const order = await prisma.order.findFirst({
        where: { razorpayOrderId: payment.order_id },
        include: {
          user: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (order) {
        // Prepare order details for email templates
        const orderDetails = {
          orderId: order.id,
          customerName: order.user.name,
          customerEmail: order.user.email,
          customerPhone: order.phone,
          items: order.items.map(item => ({
            name: item.productName + (item.variantName !== "Default" ? ` (${item.variantName})` : ""),
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: order.totalAmount, 
          shippingAddress: order.address,
          paymentMethod: order.paymentMethod || payment.method,
          orderDate: order.createdAt.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
        };

        try {
          // Send confirmation email to customer
          await sendOrderConfirmationToUser(orderDetails);
          console.log(`Order confirmation email sent to customer: ${order.user.email}`);

          // Send notification email to admin
          const adminEmail = process.env.ADMIN_EMAIL || "shivayadavsy1256@gmail.com";
          await sendOrderNotificationToAdmin(adminEmail, orderDetails);
          console.log(`Order notification email sent to admin: ${adminEmail}`);
        } catch (emailError) {
          console.error("Error sending emails:", emailError);
          // Don't throw error here as payment processing was successful
        }
      }
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
