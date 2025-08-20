import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { checkIsAdmin } from "@/lib/auth-utils";
import { redirect, RedirectType } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    redirect("/", RedirectType.replace);
  }

  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}
