import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminPagesPage() {
  // Protect page - only admins can access
  // await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground mt-1">Manage website content pages</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Page
        </Button>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <h1>Page List (to be implemented)</h1>
      </Suspense>
    </div>
  );
}
