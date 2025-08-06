"use client"
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

const allCategories = [
  {
    name: "Dairy 1",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
  },
  {
    name: "A2 Milk 2",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
  },
  {
    name: "Eggs 3",
    image:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
  },
  {
    name: "Flour 4",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
  },
  {
    name: "Ghee 5",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
  },
  {
    name: "Honey 6",
    image:
      "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=400&fit=crop",
  },
  {
    name: "Dal 7",
    image:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
  },
  {
    name: "Oil 8",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
  },
  {
    name: "Spices 9",
    image:
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop",
  },
  {
    name: "Rice 10",
    image:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
  },
  {
    name: "Honey 6",
    image:
      "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=400&fit=crop",
  },
  {
    name: "Dal 7",
    image:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
  },
  {
    name: "Oil 8",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
  },
  {
    name: "Spices 9",
    image:
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop",
  },
  {
    name: "Rice 10",
    image:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
  },
];

const CategorySection = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-farm-navy mb-12 animate-fade-in">
          Shop By Category
        </h2>

        {/* Carousel for md and up */}
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
              {allCategories.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/6">
                  <div className="p-1 select-none">
                    <div className="flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg">
                      <img
                        src={item.image}
                        className="rounded-full size-24 flex-cover"
                        alt=""
                      />
                      <span>{item.name}</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="mt-4 flex items-center justify-center gap-2">
            {" "}
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn("size-2 rounded-full bg-gray-400  ", {
                  "bg-black": current === index + 1,
                })}
              />
            ))}{" "}
          </div>
        </div>

        {/* Grid for small screens */}
        <div className="grid grid-cols-3 gap-4 md:hidden">
          {allCategories.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg p-1 select-none"
            >
              <img
                src={item.image}
                className="rounded-full size-24 flex-cover"
                alt=""
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
