import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    images: string[];
    slug: string;
    variants?: Array<{
      id: string;
      price: number;
      stock: number;
      variantName: string;
      isDefault: boolean;
      attributes: any;
    }>;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Get default variant for price display
  const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
  const price = defaultVariant?.price || 0;

  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square bg-gray-50 p-3">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 text-3xl">📦</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ₹{price}
            </span>
            {defaultVariant && defaultVariant.stock > 0 && (
              <span className="text-xs text-green-600">In Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
