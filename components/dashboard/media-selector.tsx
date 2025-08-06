"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  createdAt: Date;
}

interface MediaSelectorProps {
  media: MediaItem[];
  onSelect: (selectedUrls: string[]) => void;
  multiple?: boolean;
}

export function MediaSelector({ media, onSelect, multiple = false }: MediaSelectorProps) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredMedia = React.useMemo(() => {
    return media.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [media, searchTerm]);

  const handleItemSelect = (url: string) => {
    if (multiple) {
      setSelectedItems(prev => 
        prev.includes(url) 
          ? prev.filter(item => item !== url)
          : [...prev, url]
      );
    } else {
      setSelectedItems([url]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedItems);
  };

  // Placeholder component for when media system is not implemented
  if (media.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No media files available</p>
        <p className="text-sm text-muted-foreground mt-1">
          Media management system will be implemented later
        </p>
        <Button onClick={() => onSelect([])} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {filteredMedia.map((item) => (
          <Card
            key={item.id}
            className={`relative cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
              selectedItems.includes(item.url) ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleItemSelect(item.url)}
          >
            <div className="aspect-square relative">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover rounded-t"
              />
              {multiple && (
                <Checkbox
                  checked={selectedItems.includes(item.url)}
                  className="absolute top-2 right-2"
                />
              )}
            </div>
            <div className="p-2">
              <p className="text-xs truncate">{item.name}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSelect([])}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={selectedItems.length === 0}>
          Select {selectedItems.length > 0 && `(${selectedItems.length})`}
        </Button>
      </div>
    </div>
  );
}
