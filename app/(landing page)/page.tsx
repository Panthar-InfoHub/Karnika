"use client";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import React from "react";

const page = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-center w-full h-svh flex-col gap-4 ">
      <h1 className="text-2xl font-bold ">Home Page</h1>
      <p className="max-w-2xl">{JSON.stringify(session, null, 2)}</p>
      <p>{session?.user?.role}</p>
      <Link href="/admin" className="ml-4 text-blue-500 hover:underline">
        Go to Admin Page
      </Link>
    </div>
  );
};

export default page;
