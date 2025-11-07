"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
// import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/site.config";
import { toast } from "sonner";

export default function LoginPage() {
  // const searchParams = useSearchParams();
  // const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Error during sign-in. Please try again.");
      console.error("Error during sign-in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className=" py-20 flex items-center justify-center px-4  min-h-[60vh]">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xs rounded-lg shadow-sm border border-gray-200">
        <div className=" p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center items-center mx-auto mb-6 relative rounded-lg w-32 h-10">
            <Image
              src={siteConfig.logo.path}
              alt={siteConfig.logo.alt}
              fill
              className="object-contain"
            />
          </div>

          {/* Headings */}
          <h1 className="text-3xl font-bold text-center text-foreground mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-center font-semibold text-muted-foreground mb-8 text-sm">
            Sign in to {siteConfig.title}
          </p>

          {/* Sign-in Button */}
          <Button
            variant="outline"
            className="w-full py-5 text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors"
            onClick={handleSignIn}
            disabled={loading}
          >
            {!loading ? (
              <Image
                src="/images/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-1"
              />
            ) : (
              <Loader2 className="animate-spin mr-1" />
            )}
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <a href="/terms-and-conditions" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
