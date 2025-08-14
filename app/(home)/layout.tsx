import Footer from "@/components/home/Footer";
import Header from "@/components/home/Headers";
import Cart from "@/components/home/Cart";
import { CartProvider } from "@/context/CartContext";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full relative flex flex-col">
      <CartProvider>
        <Header />
        <main className="flex-1 w-full ">{children}</main>
        <Footer />
        <Cart />
      </CartProvider>
    </div>
  );
}
   