import { Suspense } from "react";
import { MediaGrid } from "@/components/dashboard/media-grid";
import { MediaLoading } from "@/components/dashboard/PageSkeleton";
import ErrorCard from "@/components/ErrorCard";

async function getMediaData() {
  try {
    const media = [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
        name: "product-1.jpg",
        type: "image/jpeg",
        size: 245760,
        createdAt: new Date("2023-10-01T12:00:00Z"),
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60",
        name: "product-2.jpg",
        type: "image/jpeg",
        size: 189432,
        createdAt: new Date("2023-10-02T12:00:00Z"),
      },
    ];
    return { media };
  } catch (error) {
    console.error("Failed to fetch media:", error);
    throw new Error("Failed to load media");
  }
}




export default function MediaPage() {
  return (
    <Suspense fallback={<MediaLoading />}>
      <MediaContent />
    </Suspense>
  );
}

async function MediaContent() {
  try {
    const { media } = await getMediaData();
    return <MediaGrid media={media} />;
  } catch (error) {
    return <ErrorCard error={error as Error} title="Media" />;
  }
} 