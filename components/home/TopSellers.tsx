import { prisma } from "@/prisma/db";
import ProductCard from "./ProductCard";


const TopSellers = async () => {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      variants: true,
    },
  });

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-farm-navy mb-12 animate-fade-in">
          Top Sellers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
