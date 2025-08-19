"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus, Upload, X, Edit, Loader2 } from "lucide-react";
import { createCategoryAction } from "@/actions/categoryActions";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
}

interface CreateCategoryProps {
  mode?: 'create' | 'edit';
  category?: Category;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateCategory = ({ mode = 'create', category, onSuccess, open, onOpenChange }: CreateCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update preview when category changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && category?.image) {
      setPreview(category.image);
    } else if (mode === 'create') {
      setPreview(null);
    }
  }, [mode, category?.image]);

  // Use external control when available, otherwise use internal state
  const dialogOpen = open !== undefined ? open : isOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const removeImage = () => {
    setPreview(null);
  };

  const handleSubmit = async (formData: FormData) => {
    try {

      setIsLoading(true);

      if (!formData.get("name") || !preview) {
        throw new Error("Name and image are required");
      }

      formData.append("image", preview);

      // Add category ID for edit mode
      if (mode === 'edit' && category?.id) {
        formData.append("id", category.id);
      }


      const resp = await createCategoryAction(formData);

      if (resp.error) {
        toast.error(resp.error);
        return;
      }

      const successMessage = mode === 'edit'
        ? "Category updated successfully"
        : "Category created successfully";
      toast.success(successMessage);

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = mode === 'edit'
        ? "Failed to update category"
        : "Failed to create category";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      // Reset preview: for edit mode, keep current category image, for create mode, clear it
      if (mode === 'create') {
        setPreview(null);
      }
      handleOpenChange(false);
    }
  };

  const isEditMode = mode === 'edit';
  const buttonText = isEditMode ? "Edit Category" : "Add Category";
  const dialogTitle = isEditMode ? "Edit Category" : "Add New Category";
  const dialogDescription = isEditMode
    ? "Update the category details below."
    : "Create a new product for your store. Fill in the details below.";
  const submitButtonText = isEditMode ? "Update Category" : "Add Category";

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        {mode === 'create' && (
          <DialogTrigger asChild>
            <Button variant={isEditMode ? "outline" : "default"} size={isEditMode ? "sm" : "default"}>
              {isEditMode ? (
                <Edit className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {buttonText}
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>
                {dialogDescription}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter category name"
                  defaultValue={isEditMode ? category?.name : ""}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter category description"
                  maxLength={800}
                  defaultValue={isEditMode ? category?.description || "" : ""}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-col flex gap-2">
                <Label className="text-right">Image</Label>
                <label
                  htmlFor="photo"
                  className={preview || isLoading ? "hidden" : "cursor-pointer"}
                  tabIndex={1}
                >
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                  <div className="flex flex-col items-center justify-center p-6 border border-gray-600 border-dashed rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {preview ? "Change image" : "Click to upload"}
                    </p>
                  </div>
                </label>

                {preview && (
                  <div className="relative h-40 w-full mt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="object-contain w-full h-full rounded border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={isLoading}
                      className="absolute top-0 right-0 text-white bg-black/40 p-1 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button disabled={isLoading} type="submit">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processing..." : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCategory;
