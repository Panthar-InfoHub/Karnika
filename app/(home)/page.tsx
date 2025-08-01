"use client";
import Cart from "@/components/home/Cart";
import CategorySection from "@/components/home/CategorySection";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Headers";
import HeroSection from "@/components/home/HeroSection";
import ProductCard from "@/components/home/ProductCard";
import TopSellers from "@/components/home/TopSellers";
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
    <div className="w-full ">
      {/* <Header /> */}
      <HeroSection />
      <CategorySection />
      <TopSellers />
      {/* <Footer /> */}
      <Cart />
    </div>
  );
};

export default page;
