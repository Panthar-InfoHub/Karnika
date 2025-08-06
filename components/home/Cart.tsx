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
import { placeOrder } from "@/actions/orderActions";

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

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg bg-background text-foreground">
        <SheetHeader>
          <SheetTitle className="text-farm-navy text-xl font-bold">
            Your Cart ({items.length}- {itemCount} items)
          </SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className=" mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={closeCart} className="">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg bg-background"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold text-farm-navy text-sm">
                        {item.name}
                      </h4>
                      {item.variant && (
                        <p className="text-xs text-gray-500">{item.variant}</p>
                      )}
                      <p className="text-farm-orange font-bold">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-farm-navy">Total:</span>
                <span className="text-farm-orange">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full font-semibold py-3"
                  size="lg"
                  onClick={() =>
                    placeOrder(
                      items.map((item) => ({
                        productName: item.name,
                        productImage: item.image,
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                      }))
                    )
                  }
                >
                  Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full e"
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
