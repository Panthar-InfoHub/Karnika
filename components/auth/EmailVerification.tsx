"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Mail, RefreshCw } from "lucide-react";
import { sendVerificationEmail } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EmailVerificationProps {
  email: string;
  title?: string;
  description?: React.ReactNode;
  showBackToLogin?: boolean;
  onBack?: () => void;
}

export default function EmailVerification({
  email,
  title = "Check Your Email",
  description,
  showBackToLogin = false,
  onBack
}: EmailVerificationProps) {
  const [loading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleResendVerification = async () => {


    if (!email) {
      toast.error('Email address not found. Please refresh and try again.');
      return;
    }

    setIsLoading(true);

    try {
      await sendVerificationEmail({
        email,
        fetchOptions: {
          onRequest: () => {
            setIsLoading(true);
          },
          onResponse: () => {
            setIsLoading(false);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success("Verification email sent successfully.");
            router.push("/verify-email/success?email=" + encodeURIComponent(email));
          },
        },
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-orange-600" />
        </div>
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {description || (
            <>
              We've sent a verification link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your account.
        </p>
        <div className="space-y-3">
          <Button
            onClick={handleResendVerification}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            {showBackToLogin ? (
              <>
                Back to{" "}
                <Link href="/login" className="text-orange-400 hover:underline">
                  Login
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={onBack}
                  className="text-orange-400 hover:underline"
                >
                  Go back
                </button>
              </>
            )}
          </p>
        </div>
      </CardFooter>
    </>
  );
}
