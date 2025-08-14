"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ShoppingCart, Truck } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
}

interface ShippingDetails {
  address: string;
  phone: string;
}


declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutForm() {

  const { items: cartItems, total, clearCart } = useCart();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  
  const { data: session } = useSession()

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!shippingDetails.address || !shippingDetails.phone) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (!session) {
      toast.error("Please log in to continue");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create order in database first
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
          shippingDetails 
        }),
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      toast.success("Order created! Proceeding to payment...");

      // Step 2: Create Razorpay payment order
      const paymentOrderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });

      const paymentOrderData = await paymentOrderRes.json();
      if (!paymentOrderRes.ok) {
        throw new Error(paymentOrderData.message || "Failed to create payment order");
      }

      // Step 3: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: paymentOrderData.amount,
        currency: paymentOrderData.currency,
        order_id: paymentOrderData.id,
        name: "Karnika Store",
        description: `Order #${orderData.orderId.slice(-8)}`,
        prefill: {
          name: session.user?.name,
          email: session.user?.email,
          contact: shippingDetails.phone,
        },
        handler: async function (response: any) {
          try {
            // Step 4: Verify payment & update order
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
              // Optionally redirect to order confirmation page
              // router.push(`/account/orders/${result.orderId}`);
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
        theme: { color: "#3399cc" },
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.variantId}`} className="flex justify-between items-start p-3 border rounded-lg">
                <div className="flex gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.variantName}</p>
                    {Object.keys(item.attributes).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.attributes).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-sm font-medium">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address..."
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Placing Order..." : `Place Order - ₹${total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div >
    </>
  );
}
