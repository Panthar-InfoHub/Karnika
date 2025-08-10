"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Upload,
  MoreHorizontal,
  Trash2,
  Download,
  Copy,
} from "lucide-react";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { toast } from "sonner";
import ImageUploader from "./FileUploader";


interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: Date;
}

interface MediaGridProps {
  media: MediaItem[];
}

export function MediaGrid({ media }: MediaGridProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteItem, setDeleteItem] = React.useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const filteredMedia = React.useMemo(() => {
    return media.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [media, searchTerm]);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    setIsDeleting(item.id);
    try {
      console.log("Deleting media:", item.id);
      toast.success(`Deleted ${item.name}`);
    } catch (error) {
      console.error("Failed to delete media:", error);
    } finally {
      setIsDeleting(null);
      setDeleteItem(null);
    }
  };

  return (
    <div className="space-y-6">


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">
            Manage your uploaded files and media
          </p>
        </div>
        {/* <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button> */}
      </div>
      <div className="border-b  pb-4">
        <ImageUploader />
      </div>
      <p className="font-semibold text-xl">All Media</p>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <Card key={item.id} className="group overflow-hidden p-0">
            <div className="aspect-square relative">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex  justify-end p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyUrl(item.url)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem asChild>
                      <a href={item.url} download={item.name}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteItem(item)}
                      disabled={isDeleting === item.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting === item.id ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        title="Delete Media File"
        description={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={() => deleteItem && handleDelete(deleteItem)}
        confirmText="Delete"
        isLoading={isDeleting === deleteItem?.id}
      />
    </div>
  );
}
