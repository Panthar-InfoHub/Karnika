"use client";
import { authClient, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "sonner";

const admin = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const signout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login");
        },
        onError: () => {
          toast.error(`Error signing out`);
        },
      },
    });
  };

  if (isPending) {
    return <p className="text-gray-500">Loading...</p>;
  }
  return (
    <div className="flex justify-center items-center w-full h-svh flex-col gap-4">
      {session ? (
        <>
          <p className="text-green-500">Welcome, {session.user.name}!</p>
          <button
            className="bg-red-500  rounded-xl p-2 cursor-pointer text-semibold font-white"
            onClick={signout}
          >
            Log out
          </button>
        </>
      ) : (
        <Link
          href={"/login"}
          className="bg-green-400 text-black hover:bg-green-500 rounded-xl p-2"
        >
          Login
        </Link>
      )}
      {!session && <p className="text-red-500">You are not logged in.</p>}

      <h1 className="text-2xl font-bold ">Admin Panel</h1>
      <Link href="/" className="ml-4 text-blue-500 hover:underline">
        Go to Home Page
      </Link>
    </div>
  );
};

export default admin;
