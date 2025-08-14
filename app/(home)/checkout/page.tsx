import CheckoutForm from "@/components/home/CheckoutForm";
import Script from "next/script";

export default function CheckoutPage() {



  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-600 mt-2">Review your order and provide shipping details</p>
        </div>

        <CheckoutForm />
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
