import { Prisma } from "@/prisma/generated/prisma";

export type OrderType = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
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
  };
}>;
