import CheckoutForm from "@/components/home/CheckoutForm";
import Script from "next/script";

export default function CheckoutPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your purchase securely</p>
          </div>

          <CheckoutForm />
        </div>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
