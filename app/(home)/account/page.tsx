import SignOut from "@/components/sign-out";
import React from "react";

const page = async () => {


  return (
    <div className="w-full flex-col gap-3 h-full flex justify-center items-center ">
      <h1>Only for the Customers</h1>
      <SignOut className="max-w-xs mx-auto"/>
    </div>
  );
};

export default page;
