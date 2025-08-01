import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className=" text-foreground bg-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Humpy Farms</h3>
            <p className=" mb-4">
              Your trusted family farmer providing organic, A2 certified products from farm to your doorstep.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-farm-orange cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-farm-orange cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-farm-orange cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 hover:text-farm-orange cursor-pointer transition-colors" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-farm-orange transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-farm-orange transition-colors">Shop All</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-farm-orange transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-farm-orange transition-colors">Track Order</a></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-farm-orange transition-colors">Dairy Products</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-farm-orange transition-colors">A2 Milk</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-farm-orange transition-colors">Organic Eggs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-farm-orange transition-colors">Natural Honey</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>📧 hello@humpyfarms.com</p>
              <p>📱 +91 98765 43210</p>
              <p>📍 Farm Address, Rural India</p>
              <p className="text-farm-orange font-semibold">Free Shipping over ₹1499/-</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Humpy Farms. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;