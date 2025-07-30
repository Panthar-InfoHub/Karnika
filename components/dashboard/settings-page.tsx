"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Save,
  Store,
  CreditCard,
  Truck,
  Bell,
  Users,
  Shield,
} from "lucide-react";

export function SettingsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" defaultValue="My eCommerce Store" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-url">Store URL</Label>
                  <Input id="store-url" defaultValue="mystore.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea
                  id="store-description"
                  defaultValue="A modern eCommerce store offering quality products."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                    <Store className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    defaultValue="contact@mystore.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone Number</Label>
                  <Input id="contact-phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  defaultValue="123 Business St, City, State 12345"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Configure payment options for your customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Credit Cards</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept Visa, Mastercard, American Express
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PayPal</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept PayPal payments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Apple Pay</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept Apple Pay payments
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google Pay</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept Google Pay payments
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>
                Set your store's default currency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" defaultValue="8.25" type="number" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Zones
              </CardTitle>
              <CardDescription>
                Configure shipping rates and zones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Domestic Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      United States
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$5.99</p>
                    <p className="text-sm text-muted-foreground">Standard</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">International Shipping</h4>
                    <p className="text-sm text-muted-foreground">Worldwide</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$15.99</p>
                    <p className="text-sm text-muted-foreground">Standard</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Add Shipping Zone
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
              <CardDescription>Configure shipping preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Free Shipping Threshold</Label>
                  <p className="text-sm text-muted-foreground">
                    Offer free shipping above this amount
                  </p>
                </div>
                <Input className="w-32" defaultValue="100" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Express Shipping</Label>
                  <p className="text-sm text-muted-foreground">
                    Offer express shipping options
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage your team and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      AD
                    </div>
                    <div>
                      <h4 className="font-medium">Admin User</h4>
                      <p className="text-sm text-muted-foreground">
                        admin@example.com
                      </p>
                    </div>
                  </div>
                  <Badge>Owner</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      JD
                    </div>
                    <div>
                      <h4 className="font-medium">John Doe</h4>
                      <p className="text-sm text-muted-foreground">
                        john@example.com
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Manager</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
