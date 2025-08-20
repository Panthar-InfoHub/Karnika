"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, } from "react";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmailVerification from "@/components/auth/EmailVerification";


type RegistrationState = 'form' | 'verification-sent';

export default function SignUp() {

  const [state, setState] = useState<RegistrationState>('form');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirmation = formData.get('passwordConfirmation') as string;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Name validation
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      toast.error('First name and last name must be at least 2 characters long');
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await signUp.email({
        email,
        password,
        name: `${firstName.trim()} ${lastName.trim()}`,
        fetchOptions: {
          onRequest: () => {
            setLoading(true);
          },
          onResponse: () => {
            setLoading(false);
          },
          onError: (ctx) => {
            setLoading(false);
            toast.error(ctx.error.message || 'Registration failed');
          },
          onSuccess: async () => {
            setLoading(false);
            setUserEmail(email);
            setState('verification-sent');
            toast.success('Registration successful! Please check your email to verify your account.');
          },
        },
      });
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred during registration');
    }
  };


  const renderRegistrationForm = () => (
    <form ref={formRef} onSubmit={handleSignUp}>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Max"
                required
                autoComplete="given-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Robinson"
                required
                autoComplete="family-name"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              placeholder="Confirm Password"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Create an account"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Already have an account{" "}
            <Link href="/login" className="text-orange-400">
              Login
            </Link>
          </p>
        </div>
      </CardFooter>
    </form>
  );

  const renderVerificationSent = () => (
    <EmailVerification
      email={userEmail}
      onBack={() => setState('form')}
    />
  );

  return (
    <div className="flex items-center justify-center h-full py-4">
      <Card className="rounded-md rounded-t-none max-w-md w-full">
        {state === 'form' && renderRegistrationForm()}
        {state === 'verification-sent' && renderVerificationSent()}
      </Card>
    </div>
  );
}
