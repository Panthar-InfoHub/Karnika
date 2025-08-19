"use client"
import React from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { cn } from "@/lib/utils";
import { Category } from "@/prisma/generated/prisma";
import Link from "next/link";


const CategoryCarousel = ({ categories }: { categories: Category[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Show carousel only if there are more than 6 categories
  const shouldShowCarousel = categories.length > 6;

  React.useEffect(() => {
    if (!api || !shouldShowCarousel) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, shouldShowCarousel]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Shop By Category
          </h2>
          <Link 
            href="/categories" 
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Conditional rendering based on category count */}
        {shouldShowCarousel ? (
          /* Carousel for many categories */
          <div className="hidden md:block">
            <Carousel
              opts={{
                align: "start",
                dragThreshold: 100,
                dragFree: true,
                loop: false,
              }}
              setApi={setApi}
              className="w-full max-w-[80%] mx-auto"
            >
              <CarouselContent>
                {categories.map((item, index) => (
                  <CarouselItem key={index} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                    <div className="p-2 select-none">
                      <CategoryCard item={item} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn("w-2 h-2 rounded-full bg-gray-300 transition-colors", {
                    "bg-green-600": current === index + 1,
                  })}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Direct grid display for fewer categories */
          <div className="hidden md:block">
            <div className="flex justify-center items-center gap-8 flex-wrap max-w-4xl mx-auto">
              {categories.map((item, index) => (
                <div key={index} className="flex-shrink-0">
                  <CategoryCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid for mobile screens */}
        <div className="grid grid-cols-3 gap-4 md:hidden">
          {categories.map((item, index) => (
            <div key={index}>
              <CategoryCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({ item }: { item: Category }) => {
  return (
    <Link href={`/categories/${item.slug}`} className="flex flex-col items-center justify-center cursor-pointer group">
      <div className="relative mb-3">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-200 group-hover:border-green-400 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
          {item.image ? (
            <img
              src={item.image}
              className="w-full h-full object-cover rounded-full"
              alt={item.name}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center rounded-full">
              <span className="text-green-600 text-2xl">📦</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-sm md:text-base font-medium text-center leading-tight text-gray-700 group-hover:text-green-600 transition-colors">
        {item.name}
      </span>
    </Link>
  );
};

export default CategoryCarousel;
