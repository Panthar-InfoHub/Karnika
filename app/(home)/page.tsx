import Cart from "@/components/home/Cart";
import CategorySection from "@/components/home/CategorySection";

import HeroSection from "@/components/home/HeroSection";
import TopSellers from "@/components/home/TopSellers";
import React from "react";

const page = () => {
  return (
    <div className="w-full ">
      <HeroSection />
      <CategorySection />
      <TopSellers />
      <Cart />
    </div>
  );
};

export default page;
