"use client";

import { Mail, MoreHorizontal, Search, Trash2, User } from "lucide-react";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "./customers-page";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { toast } from "sonner";

function CustomerSearch({ customers }: { customers: Customer[] }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteUser, setDeleteUser] = React.useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const handleDeleteUser = async (user: Customer) => {
    setIsDeleting(user.id);

    try {
      console.log("deleting user:", user.id);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeleteUser(null);
      setIsDeleting(null);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management </CardTitle>
          <CardDescription>View & Manage all your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={customer.image} />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>₹{customer.totalSpent}</TableCell>
                    <TableCell>{customer.createdAt?.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          "default"
                          // customer.status === "active" ? "default" : "secondary"
                        }
                      >
                        active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {/* <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem> */}
                          <DropdownMenuItem asChild>
                            <Link href={`mailto:${customer.email}`} target="blank">
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteUser(customer)}
                            disabled={isDeleting === customer.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={() => setDeleteUser(null)}
        title="Delete User"
        description={
          deleteUser
            ? `Are you sure you want to delete "${deleteUser.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={() => deleteUser && handleDeleteUser(deleteUser)}
        confirmText="Delete"
        isLoading={isDeleting === deleteUser?.id}
        variant="destructive"
      />
    </>
  );
}

export default CustomerSearch;
