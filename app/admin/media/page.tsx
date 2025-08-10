import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaGrid } from "@/components/dashboard/media-grid";

// Placeholder data fetching - implement actual media storage later
async function getMediaData() {
  try {
    // This will be replaced with actual media fetching logic
    const media = [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
        name: "product-1.jpg",
        type: "image/jpeg",
        size: 245760,
        createdAt: new Date(),
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60",
        name: "product-2.jpg",
        type: "image/jpeg",
        size: 189432,
        createdAt: new Date(),
      },
    ];

    return { media };
  } catch (error) {
    console.error("Failed to fetch media:", error);
    throw new Error("Failed to load media");
  }
}

function MediaLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}

function MediaError({ error }: { error: Error }) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Media</h2>
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription className="text-destructive">
            Failed to load media: {error.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function MediaContent() {
  try {
    const { media } = await getMediaData();
    // return <FileUploaderTest/>
    return <MediaGrid media={media} />;
  } catch (error) {
    return <MediaError error={error as Error} />;
  }
}

export default function MediaPage() {
  return (
    <Suspense fallback={<MediaLoading />}>
      <MediaContent />
    </Suspense>
  );
}
