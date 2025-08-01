"use client";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  UserStar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const categories = [
  { name: "Dairy Products", href: "#dairy" },
  { name: "A2 Milk", href: "#milk" },
  { name: "Organic Eggs", href: "#eggs" },
  { name: "Desi Grain Flours", href: "#flour" },
  { name: "Desi Cow Ghee", href: "#ghee" },
  { name: "Organic Dals", href: "#dal" },
  { name: "Natural Sweeteners", href: "#sweeteners" },
  { name: "Cold Pressed Oils", href: "#oil" },
  { name: "Dry Fruits", href: "#dryfruits" },
  { name: "Organic Seeds", href: "#seeds" },
  { name: "Organic Rice", href: "#rice" },
  { name: "Organic Masala Spices", href: "#spices" },
  { name: "Organic Millets", href: "#millet" },
  { name: "Healthy Breads", href: "#bread" },
  { name: "Natural Honeys", href: "#honey" },
];
const aboutLinks = [
  { name: "Our Story", href: "#story" },
  { name: "Our Farms", href: "#farms" },
  { name: "Quality Standards", href: "#quality" },
];

const Header = () => {
  const { openCart, itemCount } = useCart();
  const { data: session, isPending } = useSession();

  return (
    <header className="w-full top-0 sticky z-50">
      {/* Free Shipping Banner */}
      <div className="bg-indigo-800 text-white py-2 text-center text-sm">
        Free Shipping over ₹1499/-
      </div>

      {/* Main Header */}
      <div className="bg-background text-foreground border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={"/"} className="flex items-center">
              <img src={"/logo.png"} alt="karnika" className="h-12 w-auto" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a    
                href="/"
                className="text-farm-navy font-medium hover:text-farm-orange transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-farm-navy font-medium hover:text-farm-orange transition-colors"
              >
                Shop All
              </a>

              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-farm-navy font-medium hover:text-farm-orange transition-colors outline-none">
                  Shop by Category
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56  border shadow-lg z-50">
                  {categories.map((category, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="hover:bg-farm-beige"
                    >
                      <a
                        href={category.href}
                        className="w-full text-farm-navy hover:text-farm-orange"
                      >
                        {category.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* about us  */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-farm-navy font-medium hover:text-farm-orange transition-colors outline-none">
                  About
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56  border shadow-lg z-50">
                  {aboutLinks.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="hover:bg-farm-beige"
                    >
                      <a
                        href={item.href}
                        className="w-full text-farm-navy hover:text-farm-orange"
                      >
                        {item.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <a
                href="#"
                className="text-farm-navy font-medium hover:text-farm-orange transition-colors"
              >
                Contact Us
              </a>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-farm-navy hover:text-farm-orange cursor-pointer transition-colors" />
              {isPending || session?.user.role !== "ADMIN" ? (
                <Link href="/account">
                  <User className="h-5 w-5 text-farm-navy hover:text-farm-orange cursor-pointer transition-colors" />
                </Link>
              ) : (
                <Link href="/admin">
                  <UserStar className="h-5 w-5 text-farm-navy hover:text-farm-orange cursor-pointer transition-colors" />
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-0"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5 text-farm-navy hover:text-farm-orange cursor-pointer transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-fade-in">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
