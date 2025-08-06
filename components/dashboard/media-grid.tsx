"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // Could add toast notification here
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    setIsDeleting(item.id);
    try {
      // Implement delete logic here
      console.log("Deleting media:", item.id);
      // await deleteMediaAction(item.id);
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
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="secondary">
          {filteredMedia.length} {filteredMedia.length === 1 ? "file" : "files"}
        </Badge>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                    <DropdownMenuItem asChild>
                      <a href={item.url} download={item.name}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
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
            <CardContent className="p-3">
              <p className="text-xs font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(item.size)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No media files</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm
              ? "No files match your search."
              : "Get started by uploading your first file."}
          </p>
          {!searchTerm && (
            <Button className="mt-4">
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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
