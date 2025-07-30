import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return <DashboardOverview />;
}
