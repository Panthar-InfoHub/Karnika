"use client";
import SignOut from "@/components/sign-out";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-svh">
        <Loader2 className="animate-spin text-blue-500" size={24} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full h-svh flex-col gap-4 ">
      <h1 className="text-2xl font-bold ">Home Page</h1>

      {session ? (
        <>
          <p>
            {session?.user?.name}-{session?.user?.role}
          </p>
          {session?.user?.role === "ADMIN" ? (
            <Link href="/admin" className="ml-4 text-blue-500 hover:underline">
              Go to Admin Page
            </Link>
          ) : (
            <Link
              href="/accounts"
              className="ml-4 text-blue-500 hover:underline"
            >
              Go to Accounts
            </Link>
          )}

          <SignOut className="w-fit" />
        </>
      ) : (
        <Link href="/login" className="ml-4 text-blue-500 hover:underline">
          Login
        </Link>
      )}
    </div>
  );
};

export default page;
