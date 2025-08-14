"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus, Upload, X } from "lucide-react";
import { createCategoryAction } from "@/actions/categoryActions";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

const CreateCategory = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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
      if (!formData.get("name") || !preview) {
        throw new Error("Name and image are required");
      }

      formData.append("image", preview);

      const resp = await createCategoryAction(formData);

      if (resp.error) {
        toast.error(resp.error);
        return;
      }
      toast.success("Category created successfully");
    } catch (error: any) {

      toast.error("Failed to create category");

    } finally {
      setPreview(null);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <form action={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product for your store. Fill in the details below.
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
                />
              </div>
              <div className="flex-col flex gap-2">
                <Label className="text-right">Image</Label>
                <label
                  htmlFor="photo"
                  className={preview ? "hidden" : "cursor-pointer"}
                  tabIndex={1}
                >
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center p-6 border border-gray-600 border-dashed rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {preview ? "Change image" : "Click to upload"}
                    </p>
                  </div>
                </label>

                {preview && (
                  <div className="relative  h-40 w-40 mt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="object-contain w-full h-full rounded border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCategory;
