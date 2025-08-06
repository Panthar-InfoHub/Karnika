"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Image,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Overview",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Media",
    url: "/admin/media",
    icon: Image,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const SidebarLinks = () => {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navigation.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.url}
            tooltip={item.title}
            onClick={() => {
              if (isMobile) setOpenMobile(false);
            }}
            className="py-5"
          >
            <Link href={item.url} className="">
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarLinks;
