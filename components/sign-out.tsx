"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const SignOut = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: () => {
          setIsPending(false);
          toast.error("Failed to sign out. Please try again.");
        },
      },
    });
  };
  return (
    <Button
      onClick={handleSignOut}
      variant={"destructive"}
      className={cn("w-full", className)}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <span>Sign Out</span>}
    </Button>
  );
};

export default SignOut;
