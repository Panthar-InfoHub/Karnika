import Cart from "@/components/home/Cart";
import CategoryCarousel from "@/components/home/CategoryCarousel";


import HeroSection from "@/components/home/HeroSection";
import TopSellers from "@/components/home/TopSellers";
import { prisma } from "@/prisma/db";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div className="w-full ">
      <HeroSection />
      <Suspense fallback={<div className="w-full h-96 bg-gray-200 animate-pulse"></div>}>
        <CategorySection />
      </Suspense>
      <TopSellers />
      <Cart />
    </div>
  );
};

const CategorySection = async () => {

  const categories = await prisma.category.findMany();

  if (!categories) {
    return null;
  }

  return (
    <CategoryCarousel categories={[...categories, ...categories]} />
  );
}

export default page;
