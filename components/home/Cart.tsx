"use client";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const Cart = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    total,
    itemCount,
  } = useCart();
  
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg bg-white text-gray-900 p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b bg-gray-50">
          <SheetTitle className="text-gray-900 text-xl font-bold">
            Your Cart ({itemCount} items)
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4 text-lg">Your cart is empty</p>
                <Button 
                  onClick={closeCart} 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantId}`}
                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">{item.variantName}</p>
                      {Object.keys(item.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(item.attributes).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs px-2 py-0.5">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-orange-600 font-bold text-sm">
                        ₹{item.price.toFixed(2)} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id, item.variantId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-1 bg-gray-50 rounded-md p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.variantId)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-6 text-center text-xs font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.variantId)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t bg-gray-50 px-6 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-orange-600 text-xl">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-lg"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
