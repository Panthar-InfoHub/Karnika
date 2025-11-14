import { getAddresses } from "@/actions/store/address.actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load CheckoutForm (heavy component with Razorpay)
const CheckoutForm = dynamic(
  () =>
    import("@/components/store/checkout/checkout-form").then((mod) => ({
      default: mod.CheckoutForm,
    })),
  {
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default async function CheckoutPage() {
  // Get session on server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Fetch saved addresses on server
  const savedAddressesResult = await getAddresses();
  const savedAddresses =
    savedAddressesResult.success && savedAddressesResult.data ? savedAddressesResult.data : [];

  return (
    <div className="min-h-screen py-8">
      <div className="custom-container">
        <CheckoutForm userEmail={session?.user?.email} savedAddresses={savedAddresses} />
      </div>
    </div>
  );
}
