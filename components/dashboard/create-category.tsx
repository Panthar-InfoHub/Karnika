"use client";
import React from "react";
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
import { Plus } from "lucide-react";
import { createCategoryAction } from "@/actions/categoryActions";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const CreateCategory = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <form action={createCategoryAction}>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product for your store. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" />
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
