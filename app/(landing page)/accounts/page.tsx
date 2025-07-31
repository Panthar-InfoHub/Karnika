import { checkIsAdmin } from "@/utils/auth-utils";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const isAdmin = await checkIsAdmin();

  if (isAdmin) {
    redirect("/admin/settings");
  }
  return (
    <div className="w-full h-svh flex justify-center items-center ">
      <h1>Only for the Customers</h1>
    </div>
  );
};

export default page;
