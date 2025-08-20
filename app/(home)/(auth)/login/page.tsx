"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EmailVerification from "@/components/auth/EmailVerification";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/",
        fetchOptions: {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            setLoading(true);
          },
          onError: (ctx) => {

            if (ctx.error.status === 403) {
              setUnverifiedEmail(email);
              setShowVerification(true);
              toast.error("Please verify your email to continue");
            } else {
              // console.error(ctx.error);
              toast.error("Login failed. Please try again.");
            }
          },
          onSuccess: async () => {
            router.replace("/");
          },
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    setShowVerification(false);
    setUnverifiedEmail("");
  };

  return (
    <div className="flex items-center justify-center h-full py-4">
      <Card className="max-w-md w-full">
        {showVerification ? (
          <EmailVerification
            email={unverifiedEmail}
            title="Email Verification Required"
            description={
              <>
                Your account is not verified. {" "}
                <span className="font-medium text-foreground">{unverifiedEmail}</span>
              </>
            }
            onBack={handleBackToLogin}
          />
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <p> Login </p>
              )}
            </Button>

            <div
              className={cn(
                "w-full gap-2 flex items-center",
                "justify-between flex-col"
              )}
            >
              <Button
                variant="outline"
                className={cn("w-full gap-2")}
                disabled={loading}
              >
                Sign in with Google
              </Button>
            </div>
          </div>
        </CardContent>
            <CardFooter>
              <div className="flex justify-center w-full border-t py-4">
                <p className="text-center text-xs text-neutral-500">
                  Dont have an account{" "}
                  <Link href="/register" className="text-orange-400">
                    Register
                  </Link>
                </p>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
