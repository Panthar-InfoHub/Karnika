import ProductCard from "./ProductCard";

// Using placeholder images for now - in a real app, these would be actual product images
const products = [
  {
    id: "ghee-vedic",
    title: "Vedic Bilona Desi Cow Ghee",
    price: "1,600.00",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
    variants: ["500 ML", "250 ML", "5 Ltr"]
  },
  {
    id: "milk-glass",
    title: "Desi Cow's Milk (Glass Bottle)",
    price: "1,425.00",
    originalPrice: "1,650.00",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
    variants: ["15L", "20L", "5L"]
  },
  {
    id: "milk-pouch",
    title: "Desi Cow Milk (Pouch)",
    price: "1,380.00",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    variants: ["15L", "20L", "5L"]
  },
  {
    id: "paneer",
    title: "Desi Cow Paneer",
    price: "180.00",
    image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=400&fit=crop",
    variants: ["200 Grams"]
  },
  {
    id: "ghee-creamy",
    title: "Creamy Bilona Desi Cow Ghee",
    price: "1,199.00",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
    variants: ["500 ML", "250 ML"]
  },
  {
    id: "honey-tulsi",
    title: "Tulsi Natural Honey",
    price: "650.00",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    variants: ["500 Grams", "300 Grams", "150 Grams", "50 Grams"]
  },
  {
    id: "honey-forest",
    title: "Wild Forest Natural Honey",
    price: "480.00",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop",
    variants: ["500 Grams", "300 Grams", "150 Grams", "50 Grams"]
  },
  {
    id: "cheese-plain",
    title: "Desi Cow Cheese- Plain Cheese",
    price: "295.00",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
    variants: ["200 Grams"]
  }
];

const TopSellers = () => {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-farm-navy mb-12 animate-fade-in">
          Top Sellers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;