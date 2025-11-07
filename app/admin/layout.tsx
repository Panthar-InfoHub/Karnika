"use client";

import React from "react";

import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/shared/admin-sidebar";
import SignOut from "@/components/shared/sign-out";
import ThemeToggle from "@/components/admin/shared/theme-toggle";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { AdminDashboardSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { href, label };
  });

  if (isPending) {
    return <AdminDashboardSkeleton />;
  }

  if (!session || session.user.role !== "ADMIN") {
    toast.error("Unauthorized");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="p-4">Unauthorized - 404</div>
        <Button onClick={() => router.push("/")}>Go to Home</Button>
      </div>
    );
  }

  return (
    <ThemeProvider  attribute="class" defaultTheme="system">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 w-full items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb className="truncate">
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbItem>
                          <BreadcrumbPage className="truncate max-w-[160px]">
                            {crumb.label}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      ) : (
                        <>
                          <BreadcrumbItem>
                            <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="flex items-center">
                <SignOut className="h-9 px-3 py-0 text-sm" /> {/* ✅ Normalize button height */}
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
