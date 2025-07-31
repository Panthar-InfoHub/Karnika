import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "../theme-toggle";
import SignOut from "../sign-out";
import Link from "next/link";
import { Store } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-center gap-2 border-b px-4 sticky top-0 bg-background z-40">
      <Link href="/" className="flex items-center gap-2">
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
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild className="focus:outline-none">
            <Button variant="ghost" size="icon" className="p-0.5 ">
              <Avatar className="h-full w-full justify-center">
                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                <AvatarFallback>KA</AvatarFallback>
              </Avatar>
              <span className="sr-only">Admin User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[--radix-popper-anchor-width] z-50"
            sideOffset={8}
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOut className="my-1 " />
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </header>
  );
};

export default Navbar;
