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
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const router = useRouter();

  const handleResendVerification = async () => {
    if (resendCount >= 3) {
      toast.error('Maximum resend attempts reached. Please try again later.');
      return;
    }

    if (!email) {
      toast.error('Email address not found. Please refresh and try again.');
      return;
    }

    setResendLoading(true);

    try {
      await sendVerificationEmail({
        email: email,
        fetchOptions: {
          onSuccess: () => {
            setResendCount(prev => prev + 1);
            toast.success('Verification email sent successfully!');
          },
          onError: (ctx: any) => {
            if (ctx.error.message.includes('already verified')) {
              toast.success('Email already verified! You can now log in.');
              setTimeout(() => {
                router.push('/login');
              }, 2000);
            } else if (ctx.error.message.includes('rate limit') || ctx.error.message.includes('too many')) {
              toast.error('Too many verification emails sent. Please try again later.');
            } else if (ctx.error.message.includes('not found')) {
              toast.error('Account not found. Please register again.');
            } else {
              toast.error(ctx.error.message || 'Failed to resend verification email');
            }
          },
        },
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setResendLoading(false);
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
            disabled={resendLoading || resendCount >= 3}
          >
            {resendLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {resendLoading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          {resendCount > 0 && (
            <p className="text-xs text-muted-foreground">
              Emails sent: {resendCount}/3
            </p>
          )}
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
