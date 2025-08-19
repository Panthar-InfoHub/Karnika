import Footer from "@/components/home/Footer";
import Header from "@/components/home/Headers";
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
      <div className="w-full h-full relative flex flex-col light">

        <CartProvider>
          <Header />
          <main className="flex-1 w-full ">{children}</main>
          <Footer />
          <Cart />
        </CartProvider>
      </div>
    </UnThemeProvider>
  );
}
