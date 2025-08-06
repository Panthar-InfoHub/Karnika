"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription>
            We encountered an error while loading the products page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Error: {error.message}
          </p>
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
