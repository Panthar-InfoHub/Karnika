"use client";
import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square w-full max-w-md mx-auto">
        {images.length > 0 ? (
          <Image
            src={images[selectedImageIndex]}
            alt={productName}
            width={400}
            height={400}
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-4xl">📦</span>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                selectedImageIndex === index
                  ? "border-orange-400"
                  : "border-transparent hover:border-orange-300"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
