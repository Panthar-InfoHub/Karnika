import { AnnouncementBar } from "@/components/store/common/announcement-bar";
import { Footer } from "@/components/store/common/footer";
import { Header } from "@/components/store/common/header";
import { CartProvider } from "@/components/providers/cart-provider";
import { WishlistSync } from "@/components/providers/wishlist-sync";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./styless.css";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider forcedTheme="light" attribute="class" defaultTheme="light">
      <CartProvider>
        <WishlistSync />
        <div className="min-h-screen flex flex-col bg-background">
          <AnnouncementBar />
          <Header />
          <main className="grow flex-1">{children}</main>
          <Footer />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
