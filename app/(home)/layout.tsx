import Footer from "@/components/home/Footer";
import Header, { Banner } from "@/components/home/Headers";
import Cart from "@/components/home/Cart";
import { CartProvider } from "@/context/CartContext";
import { UnThemeProvider } from "@/components/theme-provider";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UnThemeProvider>
      <CartProvider>
        <div className="w-full min-h-screen relative flex flex-col light">
          <Header />
          <Banner/>
          <main className="flex-1 w-full relative ">{children}</main>
          <Footer />
          <Cart />
        </div>
      </CartProvider>
    </UnThemeProvider>
  );
}
