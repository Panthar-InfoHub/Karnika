import { prisma } from "@/prisma/db";
import ProductCard from "./ProductCard";


const TopSellers = async () => {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      images: true,
      slug: true,
      variants: {
        select: {
          id: true,
          price: true,
          stock: true,
          variantName: true,
          isDefault: true,
          attributes: true,
        },
      },
    },
  });

  // Serialize the products data to avoid JSON serialization issues
  const serializedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    images: product.images,
    slug: product.slug,
    variants: product.variants.map(variant => ({
      id: variant.id,
      price: variant.price,
      stock: variant.stock,
      variantName: variant.variantName,
      isDefault: variant.isDefault,
      attributes: typeof variant.attributes === 'object' && variant.attributes 
        ? variant.attributes as Record<string, string>
        : {}
    }))
  }));

  return (
    <section className="p-16 relative overflow-hidden w-full">
      {/* Left Border Pattern - extends to very edge */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-16 z-0"
        style={{
          backgroundImage: "url('/traditional-border.svg')",
          backgroundSize: "60px auto",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "0 0",
        }}
      ></div>
      
      {/* Right Border Pattern - extends to very edge */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-16 z-0"
        style={{
          backgroundImage: "url('/traditional-border.svg')",
          backgroundSize: "60px auto", 
          backgroundRepeat: "repeat-y",
          backgroundPosition: "0 0",
          transform: "scaleX(-1)"
        }}
      ></div>

      {/* Content with proper margins to avoid overlap with borders */}
      <div className="relative z-10 mx-auto" style={{ maxWidth: 'calc(100% - 160px)', margin: '0 80px' }}>
        <h2 className="text-4xl font-bold text-center text-farm-navy mb-12 animate-fade-in">
          Top Sellers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serializedProducts.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
