"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { Card, CardContent } from "../ui/card";
import { ShoppingCart, Lock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { z } from "zod";

interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
}

// Zod validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(10, "Please enter a complete address"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutForm() {
  const { items: cartItems, total, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  
  const { data: session } = useSession();
  const router = useRouter();

  // Auto-fill name from session
  useEffect(() => {
    if (session?.user?.name) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name
      }));
    }
  }, [session]);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const subtotal = total;
  const shipping = subtotal > 1499 ? 0 : 50;
  const finalTotal = subtotal + shipping;

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Validate form using Zod
    const validation = checkoutSchema.safeParse(formData);
    if (!validation.success) {
      toast.error("Invalid form data");
      return;
    }

    if (!session) {
      toast.error("Please log in to continue");
      return;
    }

    setLoading(true);
    try {
      const orderItems: OrderItem[] = cartItems.map(item => ({
        productId: item.id,
        variantId: item.variantId,
        variantName: item.variantName,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const createOrderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderItems,
          shippingDetails: {
            address: formData.address,
            phone: formData.phone,
            fullName: formData.fullName,
          }
        }),
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      toast.success("Order created! Proceeding to payment...");

      const paymentOrderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });

      const paymentOrderData = await paymentOrderRes.json();
      if (!paymentOrderRes.ok) {
        throw new Error(paymentOrderData.message || "Failed to create payment order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: paymentOrderData.amount,
        currency: paymentOrderData.currency,
        order_id: paymentOrderData.id,
        name: "Karnika Store",
        description: `Order #${orderData.orderId.slice(-8)}`,
        prefill: {
          name: formData.fullName,
          email: session.user?.email,
          contact: formData.phone,
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentResponse: response,
                orderId: orderData.orderId,
              }),
            });

            const result = await verifyRes.json();
            if (result.success) {
              toast.success("Payment successful! Order confirmed.");
              clearCart();
              // Use replace and add a small delay to ensure smooth transition
              setTimeout(() => {
                router.replace("/account");
              }, 1500);
            } else {
              toast.error(result.message || "Payment verification failed");
            }
          } catch (error: any) {
            toast.error("Payment verification failed. Please contact support.");
            console.error("Payment verification error:", error);
          }
        },
        modal: {
          ondismiss: function() {
            toast.warning("Payment cancelled. Your order is saved and you can retry payment later.");
          }
        },
        theme: { color: "#f97316" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment flow error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Shipping Information */}
        <div>
          <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full name *
              </Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone number *
              </Label>
              <div className="flex mt-1">
                
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className=""
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address *
              </Label>
              <Textarea
                id="address"
                placeholder="Enter your complete address..."
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={4}
                className="mt-1 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div>
          <h2 className="text-xl font-medium mb-6">Review your cart</h2>
          
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variantId}`} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.variantName}</p>
                      {Object.keys(item.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(item.attributes).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs px-2 py-0.5">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
                size="lg"
              >
                {loading ? "Processing..." : "Pay Now"}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                <span>Secure Checkout - SSL Encrypted</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
