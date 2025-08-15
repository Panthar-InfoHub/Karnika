import { Prisma } from "@/prisma/generated/prisma";

export type OrderType = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
      };
    };
    items: {
      include: {
        product: true;
        variant: true;
      };
    };
  };
}>;

export type AdminOrderType = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
      };
    };
    items: {
      include: {
        product: {
          select: {
            name: true;
            images: true;
          };
        };
        variant: {
          select: {
            variantName: true;
            attributes: true;
          };
        };
      };
    };
  };
}>;

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: {
      select: {
        id: true;
        name: true;
      };
    };
    variants: true;
  };
}>;

export type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: true;
    category: true;
  };
}>;

// Will be available after schema migration
export type ProductVariantType = Prisma.ProductVariantGetPayload<{}>;

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  variantId: string;
  variantName: string;
  quantity: number;
  attributes: Record<string, string>;
};

export interface Customer {
  id: string;
  name: string;
  email: string;
  image?: string;
  totalOrders?: number;
  createdAt?: Date;
  totalSpent?: number;
}
