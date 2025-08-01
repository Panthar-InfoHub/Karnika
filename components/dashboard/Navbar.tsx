import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

import ThemeToggle from "../theme-toggle";
import Link from "next/link";
import { Store } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-center gap-2 border-b px-4 sticky top-0 bg-background z-40">
      <Link href="/" className="flex items-center gap-2 md:hidden">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Store className="size-4" />
        </div>
        <h3 className="flex flex-col gap-0.5 leading-none font-semibold">
          Karnika Organics
        </h3>
      </Link>
      <SidebarTrigger className="-ml-1 p-4 max-md:hidden" />

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <SidebarTrigger className=" p-4 md:hidden" />
      </div>
    </header>
  );
};

export default Navbar;
